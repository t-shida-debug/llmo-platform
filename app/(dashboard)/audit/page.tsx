"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CheckCircle2, XCircle, AlertTriangle, Globe, Search } from "lucide-react";

type CheckStatus = "ok" | "warning" | "error" | "unknown";

interface AuditItem {
  label: string;
  status: CheckStatus;
  detail: string;
  recommendation?: string;
}

const AUDIT_DATA: { category: string; items: AuditItem[] }[] = [
  {
    category: "クローラーアクセス",
    items: [
      { label: "GPTBot（ChatGPT）", status: "ok", detail: "robots.txt: 許可済み", },
      { label: "OAI-SearchBot（OpenAI）", status: "ok", detail: "robots.txt: 許可済み" },
      { label: "PerplexityBot", status: "warning", detail: "robots.txt: 未明示", recommendation: "robots.txtにPerplexityBotを明示的に許可する記述を追加してください" },
      { label: "Googlebot", status: "ok", detail: "robots.txt: 許可済み" },
      { label: "GoogleExtended（AI学習）", status: "error", detail: "robots.txt: 拒否中", recommendation: "Google AI OverviewへのIndexingを許可するため、GoogleExtendedの制限を解除を検討してください" },
    ],
  },
  {
    category: "テクニカル基盤",
    items: [
      { label: "Sitemap.xml", status: "ok", detail: "検出済み: /sitemap.xml" },
      { label: "canonical設定", status: "ok", detail: "全ページにcanonical設定あり" },
      { label: "noindex設定", status: "warning", detail: "施術メニューページにnoindex発見", recommendation: "施術ページはAIに学習させたいコンテンツです。noindexを除去してください" },
      { label: "ページ速度（Core Web Vitals）", status: "warning", detail: "LCP: 3.2秒（要改善）", recommendation: "LCPを2.5秒以内に改善するとAIクロールの頻度が上がります" },
    ],
  },
  {
    category: "構造化データ",
    items: [
      { label: "LocalBusiness", status: "ok", detail: "schema.org/LocalBusiness 実装済み" },
      { label: "MedicalBusiness", status: "error", detail: "未実装", recommendation: "整骨院はMedicalBusinessタイプを追加することで専門性のアピールになります" },
      { label: "FAQPage", status: "error", detail: "未実装", recommendation: "FAQを構造化データ化することでAI回答に引用される確率が高まります" },
      { label: "Organization", status: "ok", detail: "schema.org/Organization 実装済み" },
      { label: "BreadcrumbList", status: "warning", detail: "一部ページで未実装", recommendation: "全ページにBreadcrumbListを実装してください" },
    ],
  },
  {
    category: "コンテンツ充実度",
    items: [
      { label: "店舗名・住所・電話番号", status: "ok", detail: "全ページに明記あり" },
      { label: "施術内容詳細", status: "warning", detail: "腰痛・肩こりは記載あり。交通事故は薄い", recommendation: "交通事故施術の専門ページを作成してください（Opportunity Score: 92）" },
      { label: "スタッフ・資格情報", status: "ok", detail: "柔道整復師 3名の情報あり" },
      { label: "料金表", status: "ok", detail: "施術料金ページあり" },
      { label: "FAQコンテンツ", status: "warning", detail: "3問のみ。競合は20問以上", recommendation: "FAQを20問以上に拡充してください" },
      { label: "症例・口コミ", status: "error", detail: "症例ページなし", recommendation: "症例ページを作成するとAI引用率が向上します" },
      { label: "監修者情報", status: "error", detail: "なし", recommendation: "専門家監修コンテンツはAIに高評価されます" },
    ],
  },
];

const statusIcon = (s: CheckStatus) => {
  if (s === "ok") return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
  if (s === "warning") return <AlertTriangle className="w-4 h-4 text-amber-500" />;
  if (s === "error") return <XCircle className="w-4 h-4 text-red-500" />;
  return <Globe className="w-4 h-4 text-slate-400" />;
};

const statusBadge = (s: CheckStatus) => {
  if (s === "ok") return <Badge variant="success">OK</Badge>;
  if (s === "warning") return <Badge variant="warning">要確認</Badge>;
  if (s === "error") return <Badge variant="danger">未実装</Badge>;
  return <Badge variant="default">不明</Badge>;
};

export default function AuditPage() {
  const [url, setUrl] = useState("https://honhachiman-seikotsuin.com");
  const [isRunning, setIsRunning] = useState(false);

  const allItems = AUDIT_DATA.flatMap((c) => c.items);
  const okCount = allItems.filter((i) => i.status === "ok").length;
  const warningCount = allItems.filter((i) => i.status === "warning").length;
  const errorCount = allItems.filter((i) => i.status === "error").length;
  const score = Math.round((okCount / allItems.length) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">LLMO オーディット</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          WebサイトのLLMO技術診断・コンテンツ診断
        </p>
      </div>

      {/* URL Input */}
      <Card padding="sm">
        <div className="flex items-center gap-3">
          <Globe className="w-4 h-4 text-slate-400" />
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="診断するURLを入力"
            className="flex-1 text-sm text-slate-700 bg-transparent outline-none placeholder-slate-400"
          />
          <button
            onClick={() => setIsRunning(true)}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Search className="w-4 h-4" />
            診断実行
          </button>
        </div>
      </Card>

      {/* Score Summary */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="text-center">
          <p className="text-xs text-slate-500 font-medium">LLMOオーディットスコア</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{score}</p>
          <p className="text-xs text-slate-400">/100</p>
        </Card>
        <Card className="text-center">
          <p className="text-xs text-slate-500 font-medium">OK</p>
          <p className="text-3xl font-bold text-emerald-500 mt-2">{okCount}</p>
          <p className="text-xs text-slate-400">項目</p>
        </Card>
        <Card className="text-center">
          <p className="text-xs text-slate-500 font-medium">要確認</p>
          <p className="text-3xl font-bold text-amber-500 mt-2">{warningCount}</p>
          <p className="text-xs text-slate-400">項目</p>
        </Card>
        <Card className="text-center">
          <p className="text-xs text-slate-500 font-medium">未実装</p>
          <p className="text-3xl font-bold text-red-500 mt-2">{errorCount}</p>
          <p className="text-xs text-slate-400">項目</p>
        </Card>
      </div>

      {/* Audit Results */}
      {AUDIT_DATA.map((category) => (
        <Card key={category.category} padding="none">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-700">{category.category}</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {category.items.map((item) => (
              <div key={item.label} className="px-6 py-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{statusIcon(item.status)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-slate-700">{item.label}</p>
                      {statusBadge(item.status)}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{item.detail}</p>
                    {item.recommendation && (
                      <p className="text-xs text-amber-700 bg-amber-50 rounded-md px-3 py-2 mt-2 border border-amber-100">
                        💡 {item.recommendation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
