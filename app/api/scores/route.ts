export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locationId = searchParams.get("locationId");
    const days = parseInt(searchParams.get("days") ?? "30");

    if (!locationId) {
      return NextResponse.json(
        { error: "locationId is required" },
        { status: 400 }
      );
    }

    const since = new Date();
    since.setDate(since.getDate() - days);

    const scores = await prisma.llmoScore.findMany({
      where: {
        locationId,
        date: { gte: since },
      },
      orderBy: { date: "asc" },
    });

    // 最新スコアと前期間との比較
    const latest = scores[scores.length - 1];
    const previous = scores[0];

    const summary = latest
      ? {
          currentScore: latest.totalScore,
          previousScore: previous?.totalScore ?? null,
          delta: previous ? latest.totalScore - previous.totalScore : null,
          visibilityRate: latest.visibilityRate,
          avgRank: latest.avgRank,
          shareOfVoice: latest.shareOfVoice,
        }
      : null;

    return NextResponse.json({ scores, summary });
  } catch (error) {
    console.error("GET /api/scores error:", error);
    return NextResponse.json(
      { error: "Failed to fetch scores" },
      { status: 500 }
    );
  }
}
