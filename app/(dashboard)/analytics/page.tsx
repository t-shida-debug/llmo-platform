"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { KpiCard } from "@/components/ui/ScoreGauge";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Users, MousePointer, TrendingUp, ShoppingCart } from "lucide-react";

const AI_TRAFFIC_TREND = [
  { date: "8/1", sessions: 180, cv: 10, chatgpt: 80, gemini: 50, perplexity: 30, other: 20 },
  { date: "8/8", sessions: 220, cv: 14, chatgpt: 95, gemini: 65, perplexity: 38, other: 22 },
  { date: "8/15", sessions: 195, cv: 12, chatgpt: 85, gemini: 58, perplexity: 32, other: 20 },
  { date: "8/22", sessions: 260, cv: 18, chatgpt: 112, gemini: 78, perplexity: 45, other: 25 },
  { date: "9/1", sessions: 310, cv: 22, chatgpt: 135, gemini: 92, perplexity: 55, other: 28 },
  { date: "9/8", sessions: 380, cv: 28, chatgpt: 165, gemini: 110, perplexity: 68, other: 37 },
  { date: "9/12", sessions: 420, cv: 32, chatgpt: 185, gemini: 125, perplexity: 75, other: 35 },
];

const AI_SOURCES = [
  { name: "ChatGPT", sessions: 185, pct: 44, color: "#10b981" },
  { name: "Gemini", sessions: 125, pct: 30, color: "#3b82f6" },
  { name: "Perplexity", sessions: 75, pct: 18, color: "#8b5cf6" },
  { name: "その他AI", sessions: 35, pct: 8, color: "#94a3b8" },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">アナリティクス</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          AI流入・コンバージョン分析（GA4連携）
        </p>
      </div>

      {/* Notice: GA4 連携設定 */}
      <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-4 h-4 text-blue-500 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-800">
              GA4連携（Phase 3）— 現在はデモデータを表示中
            </p>
            <p className="text-xs text-blue-600 mt-0.5">
              Google Analytics 4とSearch Consoleを接続すると、AI経由の実際の流入・予約データを取得できます。
            </p>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <KpiCard
          title="AI流入 Sessions"
          value="1,240"
          delta={18}
          deltaLabel="先月比 %"
          icon={<Users className="w-5 h-5" />}
          color="blue"
        />
        <KpiCard
          title="AI経由 CV"
          value="86"
          delta={12}
          deltaLabel="先月比 %"
          icon={<ShoppingCart className="w-5 h-5" />}
          color="green"
        />
        <KpiCard
          title="AI CVR"
          value="6.9"
          unit="%"
          delta={0.4}
          deltaLabel="先月比"
          icon={<TrendingUp className="w-5 h-5" />}
          color="purple"
        />
        <KpiCard
          title="AI CPA"
          value="¥2,140"
          delta={-180}
          deltaLabel="先月比"
          icon={<MousePointer className="w-5 h-5" />}
          color="amber"
        />
      </div>

      {/* AI Traffic Trend */}
      <Card>
        <CardHeader>
          <CardTitle>AI流入推移</CardTitle>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-slate-700 rounded-full" />
              総Sessions
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-400 rounded-full" />
              CV数
            </span>
          </div>
        </CardHeader>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart
            data={AI_TRAFFIC_TREND}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          >
            <defs>
              <linearGradient id="sessionGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
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
              dataKey="sessions"
              name="AI Sessions"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#sessionGrad)"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="cv"
              name="CV数"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        {/* AI Source Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>AI別 流入内訳</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            {AI_SOURCES.map((s) => (
              <div key={s.name} className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-medium text-slate-700">{s.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">{s.sessions.toLocaleString()}</span>
                      <span className="text-xs font-semibold text-slate-700">{s.pct}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${s.pct}%`, backgroundColor: s.color }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Source x Sessions Bar */}
        <Card>
          <CardHeader>
            <CardTitle>AI別 流入トレンド</CardTitle>
          </CardHeader>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={AI_TRAFFIC_TREND.slice(-4)}
              margin={{ top: 5, right: 10, bottom: 5, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "11px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "10px" }} />
              <Bar dataKey="chatgpt" name="ChatGPT" stackId="a" fill="#10b981" />
              <Bar dataKey="gemini" name="Gemini" stackId="a" fill="#3b82f6" />
              <Bar dataKey="perplexity" name="Perplexity" stackId="a" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Conversion Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>AI → 予約 コンバージョンファネル</CardTitle>
        </CardHeader>
        <div className="flex items-center gap-0">
          {[
            { label: "AI表示", value: "2,400回", color: "bg-blue-100 text-blue-700", arrow: true },
            { label: "AI流入", value: "1,240セッション", color: "bg-blue-200 text-blue-700", arrow: true },
            { label: "予約ページ到達", value: "320セッション", color: "bg-blue-300 text-blue-800", arrow: true },
            { label: "予約完了", value: "86件", color: "bg-blue-500 text-white", arrow: false },
          ].map((step, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className={`flex-1 ${step.color} rounded-lg p-4 text-center`}>
                <p className="text-[10px] font-semibold uppercase tracking-wide opacity-70">{step.label}</p>
                <p className="text-base font-bold mt-1">{step.value}</p>
              </div>
              {step.arrow && (
                <div className="w-6 text-center text-slate-300 text-lg">→</div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
