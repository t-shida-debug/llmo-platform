export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get("region");
    const limit = parseInt(searchParams.get("limit") ?? "20");

    const competitors = await prisma.competitor.findMany({
      where: region ? { region } : undefined,
      include: {
        mentions: {
          select: {
            rank: true,
            sentimentScore: true,
          },
        },
      },
      orderBy: { mentionCount: "desc" },
      take: limit,
    });

    // 統計を計算してマップ
    const enriched = competitors.map((c) => {
      const rankedMentions = c.mentions.filter((m) => m.rank !== null);
      const avgRank =
        rankedMentions.length > 0
          ? rankedMentions.reduce((sum, m) => sum + (m.rank ?? 0), 0) /
            rankedMentions.length
          : null;
      const firstPlaceCount = c.mentions.filter((m) => m.rank === 1).length;

      return {
        id: c.id,
        name: c.name,
        url: c.url,
        region: c.region,
        isConfirmed: c.isConfirmed,
        mentionCount: c.mentionCount,
        avgRank,
        firstPlaceCount,
      };
    });

    return NextResponse.json(enriched);
  } catch (error) {
    console.error("GET /api/competitors error:", error);
    return NextResponse.json(
      { error: "Failed to fetch competitors" },
      { status: 500 }
    );
  }
}

// 競合を確認済みにする
export async function PATCH(request: NextRequest) {
  try {
    const { id, isConfirmed } = await request.json();

    const competitor = await prisma.competitor.update({
      where: { id },
      data: { isConfirmed },
    });

    return NextResponse.json(competitor);
  } catch (error) {
    console.error("PATCH /api/competitors error:", error);
    return NextResponse.json(
      { error: "Failed to update competitor" },
      { status: 500 }
    );
  }
}
