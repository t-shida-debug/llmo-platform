import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createProvider } from "@/lib/providers";
import { aggregateDailyScore } from "@/lib/analysis/scores";
import { z } from "zod";

const RunMeasurementSchema = z.object({
  locationId: z.string(),
  promptId: z.string(),
  providerType: z.enum(["GEMINI", "OPENAI", "PERPLEXITY"]).default("GEMINI"),
  runCount: z.number().int().min(1).max(3).default(1), // 再現性対策
});

// 計測実行
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { locationId, promptId, providerType, runCount } =
      RunMeasurementSchema.parse(body);

    // 店舗・プロンプト・プロバイダー取得
    const [location, prompt, provider] = await Promise.all([
      prisma.location.findUniqueOrThrow({
        where: { id: locationId },
        include: { aliases: true },
      }),
      prisma.prompt.findUniqueOrThrow({ where: { id: promptId } }),
      prisma.provider.findFirstOrThrow({ where: { type: providerType } }),
    ]);

    // 対象ブランド名（エイリアス含む）
    const targetName = location.officialName ?? location.name;

    const llmProvider = createProvider(providerType);
    const results: Array<{
      measurementId: string;
      visibility: string;
      rank: number | null;
      sentimentScore: number | null;
    }> = [];

    let hitCount = 0;

    // 指定回数実行（再現性対策）
    for (let i = 0; i < runCount; i++) {
      const response = await llmProvider.executePrompt(prompt.text, targetName);

      if (response.analysis.targetMentioned) hitCount++;

      // Measurementを保存
      const measurement = await prisma.measurement.create({
        data: {
          locationId,
          promptId,
          providerId: provider.id,
          model: response.model,
          rawResponse: response.rawText,
          visibility: response.analysis.visibility,
          rank: response.analysis.rank,
          totalResults: response.analysis.totalResults,
          rankScore: response.analysis.rankScore,
          sentimentScore: response.analysis.sentimentScore,
          runCount,
          hitCount: i === runCount - 1 ? hitCount : 0, // 最後のrunで確定値を保存
          // Citations
          citations: {
            create: response.analysis.citations.map((c) => ({
              url: c.url,
              domain: c.domain,
              title: c.title,
              type: c.type ?? "OTHER",
              isOfficial: c.url.includes(location.url ?? "__NEVER__"),
              isCompetitor: false,
            })),
          },
          // Sentiment Details
          sentimentDetails: {
            create: response.analysis.sentimentDetails.map((s) => ({
              category: s.category,
              polarity: s.polarity,
              excerpt: s.excerpt,
              score: s.score,
            })),
          },
        },
        include: {
          citations: true,
          sentimentDetails: true,
        },
      });

      // 競合メンション保存
      for (const comp of response.analysis.competitors) {
        // 競合マスターにupsert
        const competitor = await prisma.competitor.upsert({
          where: { name: comp.name },
          create: {
            name: comp.name,
            mentionCount: 1,
          },
          update: {
            mentionCount: { increment: 1 },
          },
        });

        await prisma.competitorMention.create({
          data: {
            measurementId: measurement.id,
            competitorId: competitor.id,
            rank: comp.rank,
          },
        });
      }

      // APIコスト記録
      if (response.costEstimateUsd) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        await prisma.apiCost.upsert({
          where: {
            providerType_date: {
              providerType,
              date: today,
            },
          },
          create: {
            providerType,
            date: today,
            requestCount: 1,
            tokenCount: response.tokensUsed ?? 0,
            costUsd: response.costEstimateUsd,
          },
          update: {
            requestCount: { increment: 1 },
            tokenCount: { increment: response.tokensUsed ?? 0 },
            costUsd: { increment: response.costEstimateUsd },
          },
        });
      }

      results.push({
        measurementId: measurement.id,
        visibility: measurement.visibility,
        rank: measurement.rank,
        sentimentScore: measurement.sentimentScore,
      });
    }

    // 日次スコア集計
    await aggregateDailyScore(locationId, new Date());

    return NextResponse.json({
      success: true,
      runCount,
      hitCount,
      visibilityConfidence: (hitCount / runCount) * 100,
      results,
    });
  } catch (error) {
    console.error("POST /api/measurements error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to run measurement",
      },
      { status: 500 }
    );
  }
}

// 計測履歴取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locationId = searchParams.get("locationId");
    const promptId = searchParams.get("promptId");
    const limit = parseInt(searchParams.get("limit") ?? "50");

    const measurements = await prisma.measurement.findMany({
      where: {
        locationId: locationId ?? undefined,
        promptId: promptId ?? undefined,
      },
      include: {
        prompt: true,
        provider: true,
        citations: true,
        sentimentDetails: true,
        competitorMentions: { include: { competitor: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json(measurements);
  } catch (error) {
    console.error("GET /api/measurements error:", error);
    return NextResponse.json(
      { error: "Failed to fetch measurements" },
      { status: 500 }
    );
  }
}
