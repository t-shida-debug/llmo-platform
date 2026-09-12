import type { LLMResponse, LLMAnalysisResult } from "@/types";

// ========================================
// Provider 共通インターフェース
// ========================================

export interface LLMProvider {
  type: string;
  modelName: string;
  executePrompt(prompt: string, targetName: string): Promise<LLMResponse>;
}

// ========================================
// AI回答解析プロンプト構築
// ========================================

export function buildAnalysisPrompt(
  userPrompt: string,
  targetName: string
): string {
  return `あなたはAI検索可視性を分析するアナリストです。
以下のユーザー検索クエリに対して回答し、その後JSON形式で分析結果を返してください。

【調査対象】
店舗/ブランド名: ${targetName}

【ユーザーの検索クエリ】
${userPrompt}

まず、このクエリに対してAIアシスタントとして自然な回答をしてください。
その後、以下の形式でJSON分析結果を返してください。

---JSON_ANALYSIS_START---
{
  "targetMentioned": true/false,
  "rank": null or 数字（${targetName}が何番目に紹介されたか）,
  "totalResults": null or 数字（回答中の総店舗・選択肢数）,
  "rankScore": null or 数字（1位=100, 2位=80, 3位=60, 4位=40, 5位以下=20）,
  "visibility": "NOT_MENTIONED" | "MENTIONED" | "RECOMMENDED" | "STRONGLY_RECOMMENDED",
  "sentimentScore": 数字（-100〜+100、${targetName}への言及のトーン）,
  "recommendationLevel": "none" | "low" | "medium" | "high" | "very_high",
  "competitors": [
    {
      "name": "競合店舗名",
      "rank": 順位数字,
      "sentiment": "positive/neutral/negative",
      "positivePoints": ["強み1", "強み2"],
      "negativePoints": ["弱み1"]
    }
  ],
  "citations": [
    {
      "url": "引用URL（わかれば）",
      "domain": "ドメイン",
      "title": "ページタイトル",
      "type": "OFFICIAL" | "GOOGLE_BUSINESS_PROFILE" | "PORTAL" | "MEDIA" | "REVIEW" | "SNS" | "COMPETITOR" | "OTHER"
    }
  ],
  "sentimentDetails": [
    {
      "category": "TECHNOLOGY" | "PRICE" | "REVIEW" | "ACCESS" | "SERVICE" | "RESERVATION" | "FACILITY" | "EXPERTISE" | "RELIABILITY",
      "polarity": "POSITIVE" | "NEUTRAL" | "NEGATIVE",
      "excerpt": "該当する回答の抜粋",
      "score": 数字（-100〜+100）
    }
  ],
  "positiveFactors": ["ポジティブ要因1", "ポジティブ要因2"],
  "negativeFactors": ["ネガティブ要因1"],
  "conversionFactors": ["来院・予約につながる要因1"],
  "summary": "分析サマリー（200字以内）"
}
---JSON_ANALYSIS_END---

注意：
- ${targetName}が回答に登場しない場合、targetMentioned=falseとし、rankはnullにしてください
- 競合店舗は回答に登場したものをすべてリストアップしてください
- sentimentScoreは${targetName}への言及のトーン（ポジティブ=プラス、ネガティブ=マイナス）で判定してください`;
}

// ========================================
// JSON解析ユーティリティ
// ========================================

export function parseAnalysisResponse(rawText: string): LLMAnalysisResult {
  const startMarker = "---JSON_ANALYSIS_START---";
  const endMarker = "---JSON_ANALYSIS_END---";

  const startIdx = rawText.indexOf(startMarker);
  const endIdx = rawText.indexOf(endMarker);

  if (startIdx === -1 || endIdx === -1) {
    // JSONが見つからない場合はデフォルト値を返す
    return buildDefaultResult(rawText);
  }

  const jsonStr = rawText
    .substring(startIdx + startMarker.length, endIdx)
    .trim();

  try {
    const parsed = JSON.parse(jsonStr);
    return {
      targetMentioned: parsed.targetMentioned ?? false,
      rank: parsed.rank ?? null,
      totalResults: parsed.totalResults ?? null,
      rankScore: parsed.rankScore ?? null,
      visibility: parsed.visibility ?? "NOT_MENTIONED",
      sentimentScore: parsed.sentimentScore ?? 0,
      recommendationLevel: parsed.recommendationLevel ?? "none",
      competitors: parsed.competitors ?? [],
      citations: parsed.citations ?? [],
      sentimentDetails: parsed.sentimentDetails ?? [],
      positiveFactors: parsed.positiveFactors ?? [],
      negativeFactors: parsed.negativeFactors ?? [],
      conversionFactors: parsed.conversionFactors ?? [],
      summary: parsed.summary ?? "",
      rawResponse: rawText,
    };
  } catch {
    return buildDefaultResult(rawText);
  }
}

function buildDefaultResult(rawText: string): LLMAnalysisResult {
  return {
    targetMentioned: false,
    rank: null,
    totalResults: null,
    rankScore: null,
    visibility: "NOT_MENTIONED",
    sentimentScore: 0,
    recommendationLevel: "none",
    competitors: [],
    citations: [],
    sentimentDetails: [],
    positiveFactors: [],
    negativeFactors: [],
    conversionFactors: [],
    summary: "解析に失敗しました",
    rawResponse: rawText,
  };
}

// ========================================
// ランクスコア計算
// ========================================

export function calcRankScore(rank: number | null): number | null {
  if (rank === null) return null;
  if (rank === 1) return 100;
  if (rank === 2) return 80;
  if (rank === 3) return 60;
  if (rank === 4) return 40;
  return 20;
}
