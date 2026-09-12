import type { LLMProvider } from "./base";
import { GeminiProvider } from "./gemini";
import { OpenAIProvider } from "./openai";
import { PerplexityProvider } from "./perplexity";

export type { LLMProvider };
export { GeminiProvider, OpenAIProvider, PerplexityProvider };

// ========================================
// Providerファクトリー
// ========================================

export function createProvider(type: string): LLMProvider {
  switch (type) {
    case "GEMINI":
      return new GeminiProvider();
    case "OPENAI":
      return new OpenAIProvider();
    case "PERPLEXITY":
      return new PerplexityProvider();
    default:
      throw new Error(`Unknown provider type: ${type}`);
  }
}

// ========================================
// 利用可能なプロバイダー一覧
// ========================================

export function getAvailableProviders(): Array<{
  type: string;
  name: string;
  available: boolean;
}> {
  return [
    {
      type: "GEMINI",
      name: "Google Gemini",
      available: !!process.env.GEMINI_API_KEY,
    },
    {
      type: "OPENAI",
      name: "ChatGPT (OpenAI)",
      available: !!process.env.OPENAI_API_KEY,
    },
    {
      type: "PERPLEXITY",
      name: "Perplexity AI",
      available: !!process.env.PERPLEXITY_API_KEY,
    },
    {
      type: "GOOGLE_AIO",
      name: "Google AI Overview",
      available: false, // Phase 3
    },
    {
      type: "GOOGLE_AI_MODE",
      name: "Google AI Mode",
      available: false, // Phase 3
    },
  ];
}
