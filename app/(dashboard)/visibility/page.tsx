"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { VisibilityBadge } from "@/components/ui/Badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Play, Info } from "lucide-react";

// ヒートマップデータ（キーワード × 店舗）
const HEATMAP_KEYWORDS = [
  "本八幡でおすすめの整骨院",
  "本八幡 腰痛 整骨院",
  "本八幡 肩こり 整骨院",
  "本八幡 交通事故 整骨院",
  "本八幡 産後 骨盤矯正",
  "本八幡でおすすめを5院教えて",
  "本八幡南口接骨院の評判",
];

type VisStatus = "STRONGLY_RECOMMENDED" | "RECOMMENDED" | "MENTIONED" | "NOT_MENTIONED";

const HEATMAP_DATA: Record<string, VisStatus> = {
  "本八幡でおすすめの整骨院_Gemini": "STRONGLY_RECOMMENDED",
  "本八幡でおすすめの整骨院_ChatGPT": "RECOMMENDED",
  "本八幡でおすすめの整骨院_Perplexity": "STRONGLY_RECOMMENDED",
  "本八幡 腰痛 整骨院_Gemini": "RECOMMENDED",
  "本八幡 腰痛 整骨院_ChatGPT": "MENTIONED",
  "本八幡 腰痛 整骨院_Perplexity": "RECOMMENDED",
  "本八幡 肩こり 整骨院_Gemini": "MENTIONED",
  "本八幡 肩こり 整骨院_ChatGPT": "NOT_MENTIONED",
  "本八幡 肩こり 整骨院_Perplexity": "MENTIONED",
  "本八幡 交通事故 整骨院_Gemini": "NOT_MENTIONED",
  "本八幡 交通事故 整骨院_ChatGPT": "NOT_MENTIONED",
  "本八幡 交通事故 整骨院_Perplexity": "NOT_MENTIONED",
  "本八幡 産後 骨盤矯正_Gemini": "MENTIONED",
  "本八幡 産後 骨盤矯正_ChatGPT": "NOT_MENTIONED",
  "本八幡 産後 骨盤矯正_Perplexity": "MENTIONED",
  "本八幡でおすすめを5院教えて_Gemini": "RECOMMENDED",
  "本八幡でおすすめを5院教えて_ChatGPT": "RECOMMENDED",
  "本八幡でおすすめを5院教えて_Perplexity": "STRONGLY_RECOMMENDED",
  "本八幡南口接骨院の評判_Gemini": "STRONGLY_RECOMMENDED",
  "本八幡南口接骨院の評判_ChatGPT": "STRONGLY_RECOMMENDED",
  "本八幡南口接骨院の評判_Perplexity": "STRONGLY_RECOMMENDED",
};

const PROVIDERS = ["Gemini", "ChatGPT", "Perplexity"];

const visibilityColor: Record<VisStatus, string> = {
  STRONGLY_RECOMMENDED: "bg-emerald-400",
  RECOMMENDED: "bg-blue-400",
  MENTIONED: "bg-amber-300",
  NOT_MENTIONED: "bg-red-300",
};

const visibilityLabel: Record<VisStatus, string> = {
  STRONGLY_RECOMMENDED: "強推薦",
  RECOMMENDED: "推薦",
  MENTIONED: "言及",
  NOT_MENTIONED: "非表示",
};

const BAR_DATA = [
  { provider: "Gemini", "強推薦": 2, "推薦": 2, "言及": 2, "非表示": 1 },
  { provider: "ChatGPT", "強推薦": 2, "推薦": 2, "言及": 1, "非表示": 2 },
  { provider: "Perplexity", "強推薦": 3, "推薦": 2, "言及": 2, "非表示": 0 },
];

export default function VisibilityPage() {
  const [selectedMeasurement, setSelectedMeasurement] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">AI表示状況</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            本八幡南口接骨院 — 最終計測: 2026/09/12 14:30
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          <Play className="w-4 h-4" />
          全プロンプト計測
        </button>
      </div>

      {/* Provider比較バーチャート */}
      <Card>
        <CardHeader>
          <CardTitle>AI別 表示状況分布</CardTitle>
        </CardHeader>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={BAR_DATA}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="provider" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "11px" }} />
            <Bar dataKey="強推薦" stackId="a" fill="#34d399" radius={[0, 0, 0, 0]} />
            <Bar dataKey="推薦" stackId="a" fill="#60a5fa" />
            <Bar dataKey="言及" stackId="a" fill="#fbbf24" />
            <Bar dataKey="非表示" stackId="a" fill="#f87171" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Visibility Heatmap */}
      <Card padding="none">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700">
            キーワード × AI プロバイダー ヒートマップ
          </h3>
          <div className="flex items-center gap-3 text-xs">
            {(Object.entries(visibilityLabel) as [VisStatus, string][]).map(([k, v]) => (
              <span key={k} className="flex items-center gap-1.5 text-slate-500">
                <span className={`w-3 h-3 rounded-sm ${visibilityColor[k]}`} />
                {v}
              </span>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left text-[11px] font-semibold text-slate-500 px-6 py-3 min-w-[240px]">
                  プロンプト
                </th>
                {PROVIDERS.map((p) => (
                  <th
                    key={p}
                    className="text-center text-[11px] font-semibold text-slate-500 px-6 py-3 w-32"
                  >
                    {p}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {HEATMAP_KEYWORDS.map((keyword) => (
                <tr key={keyword} className="hover:bg-slate-50">
                  <td className="px-6 py-3">
                    <p className="text-xs text-slate-700">{keyword}</p>
                  </td>
                  {PROVIDERS.map((provider) => {
                    const key = `${keyword}_${provider}`;
                    const status = (HEATMAP_DATA[key] ?? "NOT_MENTIONED") as VisStatus;
                    return (
                      <td key={provider} className="px-6 py-3 text-center">
                        <button
                          onClick={() =>
                            setSelectedMeasurement(
                              selectedMeasurement === key ? null : key
                            )
                          }
                          className="inline-flex items-center gap-1.5"
                        >
                          <span
                            className={`w-4 h-4 rounded-sm ${visibilityColor[status]}`}
                            title={visibilityLabel[status]}
                          />
                          <span className="text-[10px] text-slate-500">
                            {visibilityLabel[status]}
                          </span>
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Recent History */}
      <Card padding="none">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-700">計測履歴</h3>
        </div>
        <div className="divide-y divide-slate-50">
          {[
            {
              id: "m1",
              prompt: "本八幡でおすすめの整骨院",
              provider: "Gemini",
              model: "gemini-1.5-pro",
              visibility: "STRONGLY_RECOMMENDED" as VisStatus,
              rank: 1,
              sentiment: 82,
              runCount: 3,
              hitCount: 3,
              date: "2026/09/12 14:30",
            },
            {
              id: "m2",
              prompt: "本八幡 腰痛 整骨院",
              provider: "Gemini",
              model: "gemini-1.5-pro",
              visibility: "RECOMMENDED" as VisStatus,
              rank: 2,
              sentiment: 70,
              runCount: 3,
              hitCount: 2,
              date: "2026/09/12 14:28",
            },
            {
              id: "m3",
              prompt: "本八幡 交通事故 整骨院",
              provider: "Gemini",
              model: "gemini-1.5-pro",
              visibility: "NOT_MENTIONED" as VisStatus,
              rank: null,
              sentiment: 0,
              runCount: 3,
              hitCount: 0,
              date: "2026/09/12 14:22",
            },
          ].map((m) => (
            <div
              key={m.id}
              className="grid grid-cols-12 gap-3 px-6 py-3.5 hover:bg-slate-50 transition-colors"
            >
              <div className="col-span-4">
                <p className="text-xs font-medium text-slate-700">{m.prompt}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{m.date}</p>
              </div>
              <div className="col-span-2 flex items-center gap-1.5">
                <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-[10px] font-medium">
                  {m.provider}
                </span>
                <span className="text-[10px] text-slate-400">{m.model}</span>
              </div>
              <div className="col-span-2 flex items-center">
                <VisibilityBadge status={m.visibility} />
              </div>
              <div className="col-span-1 flex items-center text-xs text-slate-600">
                {m.rank !== null ? `${m.rank}位` : "—"}
              </div>
              <div className="col-span-2 flex items-center gap-1">
                <span className="text-[10px] text-slate-500">信頼度</span>
                <span className="text-xs font-semibold text-slate-700">
                  {Math.round((m.hitCount / m.runCount) * 100)}%
                </span>
                <span className="text-[10px] text-slate-400">
                  ({m.hitCount}/{m.runCount})
                </span>
              </div>
              <div className="col-span-1 flex items-center justify-end">
                <button className="text-[10px] text-blue-600 hover:underline">
                  詳細
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
