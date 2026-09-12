import { GoogleGenerativeAI } from "@google/generative-ai";
import type { LLMProvider } from "./base";
import type { LLMResponse } from "@/types";
import {
  buildAnalysisPrompt,
  parseAnalysisResponse,
  calcRankScore,
} from "./base";

// ========================================
// Gemini Provider
// ========================================

export class GeminiProvider implements LLMProvider {
  type = "GEMINI" as const;
  modelName: string;
  private client: GoogleGenerativeAI;

  constructor(apiKey?: string, model = "gemini-1.5-pro") {
    const key = apiKey ?? process.env.GEMINI_API_KEY;
    if (!key) throw new Error("GEMINI_API_KEY is not set");
    this.client = new GoogleGenerativeAI(key);
    this.modelName = model;
  }

  async executePrompt(
    userPrompt: string,
    targetName: string
  ): Promise<LLMResponse> {
    const fullPrompt = buildAnalysisPrompt(userPrompt, targetName);
    const model = this.client.getGenerativeModel({ model: this.modelName });

    const result = await model.generateContent(fullPrompt);
    const rawText = result.response.text();

    const analysis = parseAnalysisResponse(rawText);

    // ランクスコアを補完
    if (analysis.rank !== null && analysis.rankScore === null) {
      analysis.rankScore = calcRankScore(analysis.rank);
    }

    // トークン数取得
    const tokensUsed = result.response.usageMetadata?.totalTokenCount;

    // コスト概算 (gemini-1.5-pro: $3.5/1M input, $10.5/1M output)
    const inputTokens = result.response.usageMetadata?.promptTokenCount ?? 0;
    const outputTokens =
      result.response.usageMetadata?.candidatesTokenCount ?? 0;
    const costEstimateUsd =
      (inputTokens * 3.5 + outputTokens * 10.5) / 1_000_000;

    return {
      provider: "GEMINI",
      model: this.modelName,
      rawText,
      analysis,
      tokensUsed,
      costEstimateUsd,
      executedAt: new Date(),
    };
  }
}
