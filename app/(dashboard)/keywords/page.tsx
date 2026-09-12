"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Plus, Search, Filter, Zap } from "lucide-react";

const INTENT_LABELS: Record<string, { label: string; color: string }> = {
  STORE_SEARCH: { label: "店舗検索", color: "blue" },
  SYMPTOM_SEARCH: { label: "症状検索", color: "purple" },
  COMPARISON_SEARCH: { label: "比較検索", color: "warning" },
  BRAND_SEARCH: { label: "ブランド", color: "success" },
  GENERAL: { label: "汎用", color: "default" },
};

const FUNNEL_LABELS: Record<string, string> = {
  AWARENESS: "認知",
  CONSIDERATION: "検討",
  DECISION: "決定",
};

const FREQ_LABELS: Record<string, { label: string; color: string }> = {
  DAILY: { label: "毎日", color: "danger" },
  WEEKLY: { label: "週1", color: "warning" },
  MONTHLY: { label: "月1", color: "default" },
};

const DEMO_PROMPTS = [
  {
    id: "1",
    text: "本八幡でおすすめの整骨院",
    region: "本八幡",
    intent: "STORE_SEARCH",
    funnel: "DECISION",
    importance: 5,
    frequency: "DAILY",
    visibilityRate: 82,
    isActive: true,
  },
  {
    id: "2",
    text: "本八幡駅近くの整骨院",
    region: "本八幡",
    intent: "STORE_SEARCH",
    funnel: "DECISION",
    importance: 4,
    frequency: "DAILY",
    visibilityRate: 74,
    isActive: true,
  },
  {
    id: "3",
    text: "本八幡 腰痛 整骨院",
    region: "本八幡",
    symptom: "腰痛",
    intent: "SYMPTOM_SEARCH",
    funnel: "CONSIDERATION",
    importance: 5,
    frequency: "WEEKLY",
    visibilityRate: 60,
    isActive: true,
  },
  {
    id: "4",
    text: "本八幡 肩こり 整骨院",
    region: "本八幡",
    symptom: "肩こり",
    intent: "SYMPTOM_SEARCH",
    funnel: "CONSIDERATION",
    importance: 4,
    frequency: "WEEKLY",
    visibilityRate: 55,
    isActive: true,
  },
  {
    id: "5",
    text: "本八幡でおすすめの整骨院を5院教えて",
    region: "本八幡",
    intent: "COMPARISON_SEARCH",
    funnel: "CONSIDERATION",
    importance: 5,
    frequency: "WEEKLY",
    visibilityRate: 68,
    isActive: true,
  },
  {
    id: "6",
    text: "本八幡 交通事故 整骨院",
    region: "本八幡",
    symptom: "交通事故",
    intent: "SYMPTOM_SEARCH",
    funnel: "DECISION",
    importance: 3,
    frequency: "WEEKLY",
    visibilityRate: 30,
    isActive: true,
  },
  {
    id: "7",
    text: "本八幡南口接骨院の評判",
    region: "本八幡",
    intent: "BRAND_SEARCH",
    funnel: "CONSIDERATION",
    importance: 4,
    frequency: "WEEKLY",
    visibilityRate: 90,
    isActive: true,
  },
  {
    id: "8",
    text: "本八幡 産後 骨盤矯正",
    region: "本八幡",
    symptom: "産後骨盤矯正",
    intent: "SYMPTOM_SEARCH",
    funnel: "CONSIDERATION",
    importance: 3,
    frequency: "MONTHLY",
    visibilityRate: 42,
    isActive: true,
  },
];

export default function KeywordsPage() {
  const [search, setSearch] = useState("");
  const [filterIntent, setFilterIntent] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = DEMO_PROMPTS.filter(
    (p) =>
      (!search || p.text.includes(search) || (p.region && p.region.includes(search)) || (p.symptom && p.symptom.includes(search))) &&
      (!filterIntent || p.intent === filterIntent)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            キーワード / プロンプト管理
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            全 {DEMO_PROMPTS.length} プロンプト
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {}}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            <Zap className="w-4 h-4 text-amber-500" />
            一括計測
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            プロンプト追加
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="プロンプトを検索..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          {Object.entries(INTENT_LABELS).map(([key, { label }]) => (
            <button
              key={key}
              onClick={() => setFilterIntent(filterIntent === key ? "" : key)}
              className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
                filterIntent === key
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Prompts Table */}
      <Card padding="none">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide px-6 py-3">プロンプト</th>
              <th className="text-center text-[11px] font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">意図</th>
              <th className="text-center text-[11px] font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">ファネル</th>
              <th className="text-center text-[11px] font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">重要度</th>
              <th className="text-center text-[11px] font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">計測頻度</th>
              <th className="text-center text-[11px] font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">表示率</th>
              <th className="text-center text-[11px] font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map((prompt) => {
              const intentConfig = INTENT_LABELS[prompt.intent];
              const freqConfig = FREQ_LABELS[prompt.frequency];

              return (
                <tr key={prompt.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3">
                    <p className="text-sm text-slate-800 font-medium">{prompt.text}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {prompt.region && (
                        <span className="text-[10px] text-slate-400">📍 {prompt.region}</span>
                      )}
                      {prompt.symptom && (
                        <span className="text-[10px] text-slate-400">🏥 {prompt.symptom}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={intentConfig.color as "blue" | "purple" | "warning" | "success" | "default"}>
                      {intentConfig.label}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-xs text-slate-600">
                      {prompt.funnel ? FUNNEL_LABELS[prompt.funnel] : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-xs ${star <= prompt.importance ? "text-amber-400" : "text-slate-200"}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={freqConfig.color as "danger" | "warning" | "default"}>
                      {freqConfig.label}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            prompt.visibilityRate >= 70
                              ? "bg-emerald-400"
                              : prompt.visibilityRate >= 40
                              ? "bg-amber-400"
                              : "bg-red-400"
                          }`}
                          style={{ width: `${prompt.visibilityRate}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-slate-700 w-7">
                        {prompt.visibilityRate}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button className="px-2.5 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors">
                      計測
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
