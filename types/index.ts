// ========================================
// LLMO Platform - 共通型定義
// ========================================

export type VisibilityStatus =
  | "NOT_MENTIONED"
  | "MENTIONED"
  | "RECOMMENDED"
  | "STRONGLY_RECOMMENDED";

export type ProviderType =
  | "GEMINI"
  | "OPENAI"
  | "PERPLEXITY"
  | "GOOGLE_AIO"
  | "GOOGLE_AI_MODE";

export type SentimentPolarity = "POSITIVE" | "NEUTRAL" | "NEGATIVE";

export type SentimentCategory =
  | "TECHNOLOGY"
  | "PRICE"
  | "REVIEW"
  | "ACCESS"
  | "SERVICE"
  | "RESERVATION"
  | "FACILITY"
  | "EXPERTISE"
  | "RELIABILITY";

export type CitationType =
  | "OFFICIAL"
  | "GOOGLE_BUSINESS_PROFILE"
  | "PORTAL"
  | "MEDIA"
  | "REVIEW"
  | "SNS"
  | "COMPETITOR"
  | "OTHER";

// ========================================
// AI回答解析結果 (LLMが返すJSON)
// ========================================

export interface CompetitorInfo {
  name: string;
  rank: number;
  sentiment?: string;
  positivePoints?: string[];
  negativePoints?: string[];
}

export interface CitationInfo {
  url: string;
  domain: string;
  title?: string;
  type?: CitationType;
}

export interface SentimentInfo {
  category: SentimentCategory;
  polarity: SentimentPolarity;
  excerpt?: string;
  score: number;
}

export interface LLMAnalysisResult {
  targetMentioned: boolean;
  rank: number | null;
  totalResults: number | null;
  rankScore: number | null;
  visibility: VisibilityStatus;
  sentimentScore: number; // -100 ~ +100
  recommendationLevel: "none" | "low" | "medium" | "high" | "very_high";
  competitors: CompetitorInfo[];
  citations: CitationInfo[];
  sentimentDetails: SentimentInfo[];
  positiveFactors: string[];
  negativeFactors: string[];
  conversionFactors: string[];
  summary: string;
  rawResponse: string;
}

// ========================================
// Provider レスポンス
// ========================================

export interface LLMResponse {
  provider: ProviderType;
  model: string;
  rawText: string;
  analysis: LLMAnalysisResult;
  tokensUsed?: number;
  costEstimateUsd?: number;
  executedAt: Date;
}

// ========================================
// ダッシュボード用集計
// ========================================

export interface DashboardStats {
  llmoScore: number;
  llmoScoreDelta: number;
  visibilityRate: number;
  visibilityRateDelta: number;
  avgRank: number | null;
  avgRankDelta: number | null;
  shareOfVoice: number;
  shareOfVoiceDelta: number;
  officialCitationRate: number;
  totalMeasurements: number;
}

export interface VisibilityTrend {
  date: string;
  visibilityRate: number;
  avgRank: number | null;
  shareOfVoice: number;
  sentimentScore: number;
  llmoScore: number;
}

export interface CompetitorRanking {
  name: string;
  shareOfVoice: number;
  avgRank: number | null;
  mentionCount: number;
  firstPlaceCount: number;
  isTarget?: boolean;
}

export interface CitationDomain {
  domain: string;
  count: number;
  percentage: number;
  type: CitationType;
  isOfficial: boolean;
}
