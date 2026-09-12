import type { LLMProvider } from "./base";
import type { LLMResponse } from "@/types";
import {
  buildAnalysisPrompt,
  parseAnalysisResponse,
  calcRankScore,
} from "./base";

// ========================================
// OpenAI Provider (ChatGPT)
// Phase 2で実装予定 - 現在はスタブ
// ========================================

export class OpenAIProvider implements LLMProvider {
  type = "OPENAI" as const;
  modelName: string;

  constructor(_apiKey?: string, model = "gpt-4o") {
    this.modelName = model;
  }

  async executePrompt(
    userPrompt: string,
    targetName: string
  ): Promise<LLMResponse> {
    // TODO: Phase 2で実装
    // OpenAI APIキーが設定されていれば実際のAPIを呼び出す
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "OpenAI provider is not yet configured. Please set OPENAI_API_KEY."
      );
    }

    // Dynamic import for optional dependency
    const { default: OpenAI } = await import("openai");
    const client = new OpenAI({ apiKey });

    const fullPrompt = buildAnalysisPrompt(userPrompt, targetName);

    const response = await client.chat.completions.create({
      model: this.modelName,
      messages: [{ role: "user", content: fullPrompt }],
      temperature: 0.3,
    });

    const rawText = response.choices[0]?.message?.content ?? "";
    const analysis = parseAnalysisResponse(rawText);

    if (analysis.rank !== null && analysis.rankScore === null) {
      analysis.rankScore = calcRankScore(analysis.rank);
    }

    const tokensUsed = response.usage?.total_tokens;

    return {
      provider: "OPENAI",
      model: this.modelName,
      rawText,
      analysis,
      tokensUsed,
      executedAt: new Date(),
    };
  }
}
