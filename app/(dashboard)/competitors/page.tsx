"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CheckCircle2, AlertCircle } from "lucide-react";

const COMPETITOR_DATA = [
  {
    id: "1",
    name: "A整骨院",
    region: "本八幡",
    sov: 28,
    avgRank: 1.4,
    mentionCount: 142,
    firstPlaceCount: 38,
    sentiment: "positive",
    isConfirmed: true,
    topPrompts: ["本八幡でおすすめの整骨院", "本八幡駅近くの整骨院"],
  },
  {
    id: "2",
    name: "B整体院",
    region: "本八幡",
    sov: 22,
    avgRank: 1.9,
    mentionCount: 110,
    firstPlaceCount: 20,
    sentiment: "neutral",
    isConfirmed: true,
    topPrompts: ["本八幡でおすすめを5院教えて"],
  },
  {
    id: "3",
    name: "本八幡南口接骨院（自社）",
    region: "本八幡",
    sov: 21,
    avgRank: 2.0,
    mentionCount: 105,
    firstPlaceCount: 18,
    sentiment: "positive",
    isConfirmed: true,
    isTarget: true,
    topPrompts: ["本八幡南口接骨院の評判", "本八幡でおすすめの整骨院"],
  },
  {
    id: "4",
    name: "C整骨院",
    region: "本八幡",
    sov: 15,
    avgRank: 2.8,
    mentionCount: 75,
    firstPlaceCount: 8,
    sentiment: "neutral",
    isConfirmed: true,
    topPrompts: [],
  },
  {
    id: "5",
    name: "D接骨院",
    region: "本八幡",
    sov: 9,
    avgRank: 3.4,
    mentionCount: 45,
    firstPlaceCount: 3,
    sentiment: "neutral",
    isConfirmed: false,
    topPrompts: [],
  },
  {
    id: "6",
    name: "E整形外科",
    region: "本八幡",
    sov: 5,
    avgRank: 4.1,
    mentionCount: 25,
    firstPlaceCount: 1,
    sentiment: "negative",
    isConfirmed: false,
    topPrompts: [],
  },
];

const SOV_CHART_DATA = COMPETITOR_DATA.map((c) => ({
  name: c.isTarget ? "自社" : c.name.replace("整骨院", "").replace("接骨院", "").replace("整体院", "").trim(),
  sov: c.sov,
  fill: c.isTarget ? "#3b82f6" : "#e2e8f0",
}));

export default function CompetitorsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">競合分析</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          本八幡エリア — AI検索シェアランキング
        </p>
      </div>

      {/* SOV Chart */}
      <div className="grid grid-cols-5 gap-4">
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>AI Share of Voice ランキング</CardTitle>
          </CardHeader>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={SOV_CHART_DATA}
              layout="vertical"
              margin={{ top: 0, right: 30, bottom: 0, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} unit="%" axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={60}
              />
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(value) => [`${value}%`, "SOV"]}
              />
              <Bar dataKey="sov" fill="#3b82f6" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>競合サマリー</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-slate-50">
              <span className="text-xs text-slate-500">競合数（確認済）</span>
              <span className="text-sm font-bold text-slate-800">
                {COMPETITOR_DATA.filter((c) => c.isConfirmed && !c.isTarget).length}社
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-50">
              <span className="text-xs text-slate-500">未確認（AI自動抽出）</span>
              <span className="text-sm font-bold text-amber-600">
                {COMPETITOR_DATA.filter((c) => !c.isConfirmed).length}社
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-50">
              <span className="text-xs text-slate-500">自社SOV順位</span>
              <span className="text-sm font-bold text-blue-600">3位 / {COMPETITOR_DATA.length}社</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-xs text-slate-500">首位との差</span>
              <span className="text-sm font-bold text-red-500">-7%</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Competitor Detail Table */}
      <Card padding="none">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700">競合リスト</h3>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            未確認の競合は確認ボタンで登録
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left text-[11px] font-semibold text-slate-500 px-6 py-3">競合名</th>
              <th className="text-center text-[11px] font-semibold text-slate-500 px-4 py-3">SOV</th>
              <th className="text-center text-[11px] font-semibold text-slate-500 px-4 py-3">平均順位</th>
              <th className="text-center text-[11px] font-semibold text-slate-500 px-4 py-3">言及数</th>
              <th className="text-center text-[11px] font-semibold text-slate-500 px-4 py-3">1位獲得</th>
              <th className="text-center text-[11px] font-semibold text-slate-500 px-4 py-3">感情</th>
              <th className="text-center text-[11px] font-semibold text-slate-500 px-4 py-3">ステータス</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {COMPETITOR_DATA.map((c, i) => (
              <tr
                key={c.id}
                className={`hover:bg-slate-50 transition-colors ${c.isTarget ? "bg-blue-50/30" : ""}`}
              >
                <td className="px-6 py-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                        i === 0 ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <div>
                      <p className={`text-sm font-medium ${c.isTarget ? "text-blue-700" : "text-slate-800"}`}>
                        {c.name}
                        {c.isTarget && (
                          <span className="ml-1.5 px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded text-[10px]">
                            自社
                          </span>
                        )}
                      </p>
                      <p className="text-[10px] text-slate-400">{c.region}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-sm font-bold text-slate-800">{c.sov}%</span>
                    <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${c.isTarget ? "bg-blue-400" : "bg-slate-300"}`}
                        style={{ width: `${c.sov}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-sm text-slate-600">
                  {c.avgRank.toFixed(1)}
                </td>
                <td className="px-4 py-3 text-center text-sm text-slate-600">
                  {c.mentionCount}
                </td>
                <td className="px-4 py-3 text-center text-sm text-slate-600">
                  {c.firstPlaceCount}回
                </td>
                <td className="px-4 py-3 text-center">
                  <Badge
                    variant={
                      c.sentiment === "positive"
                        ? "success"
                        : c.sentiment === "negative"
                        ? "danger"
                        : "slate"
                    }
                  >
                    {c.sentiment === "positive" ? "ポジティブ" : c.sentiment === "negative" ? "ネガティブ" : "中立"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-center">
                  {c.isConfirmed ? (
                    <span className="flex items-center justify-center gap-1 text-[10px] text-emerald-600">
                      <CheckCircle2 className="w-3 h-3" />
                      確認済
                    </span>
                  ) : (
                    <button className="px-2.5 py-1 text-[10px] font-medium text-amber-700 bg-amber-50 rounded-md hover:bg-amber-100 transition-colors">
                      確認する
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
