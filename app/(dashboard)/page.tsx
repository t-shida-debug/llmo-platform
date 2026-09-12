"use client";

import { useState, useEffect, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { ScoreGauge, KpiCard } from "@/components/ui/ScoreGauge";
import { VisibilityBadge } from "@/components/ui/Badge";
import { Eye, TrendingUp, Share2, Link2, Zap, RefreshCw } from "lucide-react";

// ダミーデータ（DB接続前のデモ用）
const DEMO_TREND = [
  { date: "9/1", visibility: 55, rank: 2.8, sov: 14, sentiment: 62 },
  { date: "9/3", visibility: 60, rank: 2.5, sov: 16, sentiment: 65 },
  { date: "9/5", visibility: 58, rank: 2.7, sov: 15, sentiment: 63 },
  { date: "9/7", visibility: 68, rank: 2.1, sov: 18, sentiment: 70 },
  { date: "9/9", visibility: 72, rank: 1.9, sov: 20, sentiment: 74 },
  { date: "9/11", visibility: 70, rank: 2.0, sov: 19, sentiment: 72 },
  { date: "9/12", visibility: 74, rank: 1.8, sov: 21, sentiment: 76 },
];

const DEMO_COMPETITORS = [
  { name: "A整骨院", sov: 28, rank: 1.4, isTarget: false },
  { name: "B整体院", sov: 22, rank: 1.9, isTarget: false },
  { name: "本八幡南口接骨院（自社）", sov: 21, rank: 2.0, isTarget: true },
  { name: "C整骨院", sov: 15, rank: 2.8, isTarget: false },
  { name: "D接骨院", sov: 9, rank: 3.4, isTarget: false },
];

const DEMO_CITATIONS = [
  { domain: "Google Maps", pct: 42 },
  { domain: "公式HP", pct: 31 },
  { domain: "HotPepper Beauty", pct: 14 },
  { domain: "EPARK", pct: 8 },
  { domain: "その他", pct: 5 },
];

const DOMAIN_COLORS = [
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#8b5cf6",
  "#64748b",
];

export default function DashboardPage() {
  const [period, setPeriod] = useState<"day" | "week" | "month">("week");
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsLoading(false);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">ダッシュボード</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            本八幡南口接骨院 — LLMO監視レポート
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 rounded-lg p-1 text-xs">
            {(["day", "week", "month"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  period === p
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {p === "day" ? "日次" : p === "week" ? "週次" : "月次"}
              </button>
            ))}
          </div>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
            />
            更新
          </button>
        </div>
      </div>

      {/* LLMO Score + KPIs */}
      <div className="grid grid-cols-5 gap-4">
        {/* LLMO Score */}
        <Card className="col-span-1 flex flex-col items-center justify-center py-8">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
            LLMO SCORE
          </p>
          <ScoreGauge score={78} label="本八幡南口接骨院" size="md" />
          <div className="mt-4 text-center">
            <span className="text-xs text-emerald-600 font-semibold">
              ↑ +14 先月比
            </span>
          </div>
        </Card>

        {/* KPIs */}
        <div className="col-span-4 grid grid-cols-2 grid-rows-2 gap-4">
          <KpiCard
            title="AI表示率"
            value="72"
            unit="%"
            delta={4.2}
            deltaLabel="先週比"
            icon={<Eye className="w-5 h-5" />}
            color="blue"
          />
          <KpiCard
            title="平均順位"
            value="1.8"
            unit="位"
            delta={-0.3}
            deltaLabel="先週比"
            icon={<TrendingUp className="w-5 h-5" />}
            color="green"
          />
          <KpiCard
            title="AI Share of Voice"
            value="21"
            unit="%"
            delta={2}
            deltaLabel="先週比"
            icon={<Share2 className="w-5 h-5" />}
            color="purple"
          />
          <KpiCard
            title="Official Citation率"
            value="64"
            unit="%"
            delta={-1.5}
            deltaLabel="先週比"
            icon={<Link2 className="w-5 h-5" />}
            color="amber"
          />
        </div>
      </div>

      {/* Visibility Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>AI表示率 推移</CardTitle>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full" />
              表示率
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full" />
              Share of Voice
            </span>
          </div>
        </CardHeader>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart
            data={DEMO_TREND}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          >
            <defs>
              <linearGradient id="visGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="sovGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              unit="%"
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Area
              type="monotone"
              dataKey="visibility"
              name="表示率"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#visGrad)"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="sov"
              name="Share of Voice"
              stroke="#22c55e"
              strokeWidth={2}
              fill="url(#sovGrad)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Bottom row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Competitor Ranking */}
        <Card>
          <CardHeader>
            <CardTitle>競合 AI SOVランキング</CardTitle>
            <span className="text-xs text-slate-400">本八幡 整骨院</span>
          </CardHeader>
          <div className="space-y-3">
            {DEMO_COMPETITORS.map((c, i) => (
              <div key={c.name} className="flex items-center gap-3">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    i === 0
                      ? "bg-amber-100 text-amber-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-xs font-medium truncate ${
                      c.isTarget ? "text-blue-700" : "text-slate-700"
                    }`}
                  >
                    {c.name}
                    {c.isTarget && (
                      <span className="ml-1 px-1 py-0.5 bg-blue-100 text-blue-600 rounded text-[10px]">
                        自社
                      </span>
                    )}
                  </p>
                  <div className="mt-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        c.isTarget ? "bg-blue-500" : "bg-slate-300"
                      }`}
                      style={{ width: `${c.sov}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-600 w-8 text-right">
                  {c.sov}%
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Citation Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Citation ソース</CardTitle>
            <span className="text-xs text-slate-400">引用元ドメイン分布</span>
          </CardHeader>
          <div className="space-y-3">
            {DEMO_CITATIONS.map((c, i) => (
              <div key={c.domain} className="flex items-center gap-3">
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: DOMAIN_COLORS[i] }}
                />
                <p className="flex-1 text-xs text-slate-700 truncate">
                  {c.domain}
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${c.pct}%`,
                        backgroundColor: DOMAIN_COLORS[i],
                      }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-600 w-7 text-right">
                    {c.pct}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Measurements */}
      <Card padding="none">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-700">直近の計測結果</h3>
        </div>
        <div className="divide-y divide-slate-50">
          {[
            {
              prompt: "本八幡でおすすめの整骨院",
              provider: "Gemini",
              visibility: "STRONGLY_RECOMMENDED",
              rank: 1,
              sentiment: 82,
              date: "2026/09/12 14:30",
            },
            {
              prompt: "本八幡 腰痛 整骨院",
              provider: "Gemini",
              visibility: "RECOMMENDED",
              rank: 2,
              sentiment: 70,
              date: "2026/09/12 14:28",
            },
            {
              prompt: "本八幡でおすすめの整骨院を5院教えて",
              provider: "Gemini",
              visibility: "MENTIONED",
              rank: 3,
              sentiment: 60,
              date: "2026/09/12 14:25",
            },
            {
              prompt: "本八幡 交通事故 整骨院",
              provider: "Gemini",
              visibility: "NOT_MENTIONED",
              rank: null,
              sentiment: 0,
              date: "2026/09/12 14:22",
            },
          ].map((m, i) => (
            <div
              key={i}
              className="grid grid-cols-12 gap-4 px-6 py-3 hover:bg-slate-50 transition-colors"
            >
              <div className="col-span-4">
                <p className="text-xs text-slate-700 font-medium truncate">
                  {m.prompt}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">{m.date}</p>
              </div>
              <div className="col-span-2 flex items-center">
                <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-[10px] font-medium">
                  {m.provider}
                </span>
              </div>
              <div className="col-span-3 flex items-center">
                <VisibilityBadge status={m.visibility} />
              </div>
              <div className="col-span-1 flex items-center text-xs text-slate-600">
                {m.rank !== null ? `${m.rank}位` : "—"}
              </div>
              <div className="col-span-2 flex items-center">
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      m.sentiment >= 60
                        ? "bg-emerald-400"
                        : m.sentiment >= 30
                        ? "bg-amber-400"
                        : "bg-red-400"
                    }`}
                  />
                  <span className="text-xs text-slate-600">
                    {m.sentiment > 0 ? `+${m.sentiment}` : m.sentiment}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
