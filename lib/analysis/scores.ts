import { prisma } from "@/lib/db";

// ========================================
// LLMOスコア算出ロジック
// ========================================

interface ScoreInput {
  visibilityRate: number; // 0-100 (%)
  avgRank: number | null;
  shareOfVoice: number; // 0-100 (%)
  officialCitationRate: number; // 0-100 (%)
  avgSentimentScore: number; // -100 ~ +100 → 0-100に変換
}

export function calcLlmoScore(input: ScoreInput): {
  visibilityScore: number;
  rankScore: number;
  shareOfVoiceScore: number;
  citationScore: number;
  sentimentScore: number;
  officialCitationScore: number;
  totalScore: number;
} {
  // AI Visibility (30点満点)
  const visibilityScore = Math.min(30, (input.visibilityRate / 100) * 30);

  // Average Rank (20点満点) - 順位が良いほど高得点
  let rankScore = 0;
  if (input.avgRank !== null) {
    if (input.avgRank <= 1) rankScore = 20;
    else if (input.avgRank <= 2) rankScore = 16;
    else if (input.avgRank <= 3) rankScore = 12;
    else if (input.avgRank <= 5) rankScore = 8;
    else rankScore = 4;
  }

  // Share of Voice (15点満点)
  const shareOfVoiceScore = Math.min(15, (input.shareOfVoice / 100) * 15);

  // Citation (15点満点) - シンプルにcitation rateで換算
  const citationScore = Math.min(
    15,
    ((input.officialCitationRate + input.visibilityRate) / 200) * 15
  );

  // Sentiment (10点満点) - -100~+100 → 0-10
  const sentimentNormalized = (input.avgSentimentScore + 100) / 200; // 0-1
  const sentimentScore = Math.min(10, sentimentNormalized * 10);

  // Official Site Citation (10点満点)
  const officialCitationScore = Math.min(
    10,
    (input.officialCitationRate / 100) * 10
  );

  const totalScore = Math.round(
    visibilityScore +
      rankScore +
      shareOfVoiceScore +
      citationScore +
      sentimentScore +
      officialCitationScore
  );

  return {
    visibilityScore: Math.round(visibilityScore * 10) / 10,
    rankScore: Math.round(rankScore * 10) / 10,
    shareOfVoiceScore: Math.round(shareOfVoiceScore * 10) / 10,
    citationScore: Math.round(citationScore * 10) / 10,
    sentimentScore: Math.round(sentimentScore * 10) / 10,
    officialCitationScore: Math.round(officialCitationScore * 10) / 10,
    totalScore: Math.min(100, totalScore),
  };
}

// ========================================
// 日次スコア集計（特定店舗）
// ========================================

export async function aggregateDailyScore(
  locationId: string,
  date: Date
): Promise<void> {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  // その日の計測データを取得
  const measurements = await prisma.measurement.findMany({
    where: {
      locationId,
      createdAt: { gte: startOfDay, lte: endOfDay },
    },
    include: {
      citations: true,
    },
  });

  if (measurements.length === 0) return;

  // 指標を算出
  const mentionedCount = measurements.filter(
    (m) => m.visibility !== "NOT_MENTIONED"
  ).length;
  const visibilityRate = (mentionedCount / measurements.length) * 100;

  const rankedMeasurements = measurements.filter((m) => m.rank !== null);
  const avgRank =
    rankedMeasurements.length > 0
      ? rankedMeasurements.reduce((sum, m) => sum + (m.rank ?? 0), 0) /
        rankedMeasurements.length
      : null;

  const avgSentimentScore =
    measurements.reduce((sum, m) => sum + (m.sentimentScore ?? 0), 0) /
    measurements.length;

  const avgShareOfVoice =
    measurements.reduce((sum, m) => sum + (m.shareOfVoice ?? 0), 0) /
    measurements.length;

  // Official Citation Rate
  const allCitations = measurements.flatMap((m) => m.citations);
  const officialCitations = allCitations.filter((c) => c.isOfficial);
  const officialCitationRate =
    mentionedCount > 0
      ? (officialCitations.length / mentionedCount) * 100
      : 0;

  const scores = calcLlmoScore({
    visibilityRate,
    avgRank,
    shareOfVoice: avgShareOfVoice,
    officialCitationRate,
    avgSentimentScore,
  });

  // Upsert
  await prisma.llmoScore.upsert({
    where: {
      locationId_date: {
        locationId,
        date: startOfDay,
      },
    },
    create: {
      locationId,
      date: startOfDay,
      visibilityRate,
      avgRank,
      shareOfVoice: avgShareOfVoice,
      ...scores,
    },
    update: {
      visibilityRate,
      avgRank,
      shareOfVoice: avgShareOfVoice,
      ...scores,
    },
  });
}
