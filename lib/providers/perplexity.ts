import type { LLMProvider } from "./base";
import type { LLMResponse } from "@/types";
import {
  buildAnalysisPrompt,
  parseAnalysisResponse,
  calcRankScore,
} from "./base";

// ========================================
// Perplexity Provider
// Phase 2で実装予定 - 現在はスタブ
// ========================================

export class PerplexityProvider implements LLMProvider {
  type = "PERPLEXITY" as const;
  modelName: string;

  constructor(_apiKey?: string, model = "llama-3.1-sonar-large-128k-online") {
    this.modelName = model;
  }

  async executePrompt(
    userPrompt: string,
    targetName: string
  ): Promise<LLMResponse> {
    const apiKey = process.env.PERPLEXITY_API_KEY;
    if (!apiKey) {
      throw new Error(
        "Perplexity provider is not yet configured. Please set PERPLEXITY_API_KEY."
      );
    }

    // Perplexity はOpenAI互換APIを使用
    const fullPrompt = buildAnalysisPrompt(userPrompt, targetName);

    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.modelName,
        messages: [{ role: "user", content: fullPrompt }],
        temperature: 0.3,
        return_citations: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.statusText}`);
    }

    const data = await response.json();
    const rawText = data.choices?.[0]?.message?.content ?? "";
    const analysis = parseAnalysisResponse(rawText);

    // Perplexityはcitationsを直接返す場合がある
    if (data.citations && analysis.citations.length === 0) {
      analysis.citations = (data.citations as string[]).map((url: string) => ({
        url,
        domain: new URL(url).hostname,
        type: "OTHER" as const,
      }));
    }

    if (analysis.rank !== null && analysis.rankScore === null) {
      analysis.rankScore = calcRankScore(analysis.rank);
    }

    return {
      provider: "PERPLEXITY",
      model: this.modelName,
      rawText,
      analysis,
      tokensUsed: data.usage?.total_tokens,
      executedAt: new Date(),
    };
  }
}
