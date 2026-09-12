"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { ScoreGauge } from "@/components/ui/ScoreGauge";
import { FileText, Download, Calendar, TrendingUp, TrendingDown } from "lucide-react";

export default function ReportsPage() {
  const [reportType, setReportType] = useState<"monthly" | "weekly">("monthly");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">レポート</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            月次・週次 LLMOレポート生成
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 rounded-lg p-1 text-xs">
            <button
              onClick={() => setReportType("monthly")}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                reportType === "monthly"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              月次
            </button>
            <button
              onClick={() => setReportType("weekly")}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                reportType === "weekly"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              週次
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            PDFエクスポート
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" />
            CSVエクスポート
          </button>
        </div>
      </div>

      {/* Report Preview */}
      <Card padding="lg">
        {/* Report Header */}
        <div className="border-b border-slate-100 pb-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest">
                LLMO Monthly Report
              </p>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">
                本八幡南口接骨院
              </h2>
              <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                2026年8月 計測レポート
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">生成日</p>
              <p className="text-sm font-medium text-slate-700">2026/09/12</p>
            </div>
          </div>
        </div>

        {/* LLMO Score Section */}
        <div className="grid grid-cols-3 gap-8 mb-8">
          <div className="flex flex-col items-center">
            <ScoreGauge score={78} label="LLMO SCORE" size="md" />
          </div>
          <div className="col-span-2">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">
              エグゼクティブサマリー
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              2026年8月の本八幡南口接骨院のLLMOスコアは
              <strong className="text-blue-600"> 78/100</strong>
              で、前月（64点）比
              <strong className="text-emerald-600"> +14ポイント</strong>
              の大幅改善を達成しました。AI表示率は72%（前月58%）に向上し、平均順位は1.8位（前月2.6位）と競合を上回る水準になりました。
            </p>
            <p className="text-sm text-slate-600 leading-relaxed mt-2">
              特に「本八幡でおすすめの整骨院」クエリでGemini・Perplexityの両方で強推薦（1位）を獲得。一方、「交通事故 整骨院」ジャンルは3プロバイダー全てで非表示が続いており、改善余地があります。
            </p>
          </div>
        </div>

        {/* KPI Summary */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          {[
            { label: "AI表示率", current: "72%", prev: "58%", delta: "+14%", up: true },
            { label: "平均順位", current: "1.8", prev: "2.6", delta: "-0.8", up: true },
            { label: "Share of Voice", current: "21%", prev: "16%", delta: "+5%", up: true },
            { label: "Citation率", current: "64%", prev: "71%", delta: "-7%", up: false },
            { label: "Sentiment", current: "+72", prev: "+61", delta: "+11", up: true },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-slate-50 rounded-xl p-4 text-center">
              <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">
                {kpi.label}
              </p>
              <p className="text-xl font-bold text-slate-900 mt-1">{kpi.current}</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                {kpi.up ? (
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-400" />
                )}
                <span className={`text-xs font-medium ${kpi.up ? "text-emerald-600" : "text-red-500"}`}>
                  {kpi.delta}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">前月: {kpi.prev}</p>
            </div>
          ))}
        </div>

        {/* Improvement Actions */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">
            実施した改善施策
          </h3>
          <div className="space-y-2">
            {[
              {
                action: "FAQページ追加（5問）",
                date: "8/10",
                before: "表示率 52%",
                after: "表示率 72%",
                delta: "+20%",
              },
              {
                action: "schema.org LocalBusiness 更新",
                date: "8/15",
                before: "Citation率 71%",
                after: "Citation率 64%",
                delta: "-7%（確認中）",
              },
            ].map((a, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-3 bg-white border border-slate-100 rounded-lg text-sm"
              >
                <span className="text-xs text-slate-400 w-12 flex-shrink-0">
                  {a.date}
                </span>
                <span className="flex-1 text-slate-700">{a.action}</span>
                <span className="text-xs text-slate-400">{a.before}</span>
                <span className="text-slate-300">→</span>
                <span className="text-xs font-medium text-slate-700">{a.after}</span>
                <span className="text-xs font-semibold text-emerald-600 w-16 text-right">
                  {a.delta}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Next Month Actions */}
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-3">
            来月の改善施策（推奨）
          </h3>
          <div className="space-y-2">
            {[
              { priority: "高", action: "交通事故専門ページ作成", impact: "Opportunity Score 92", deadline: "9/30" },
              { priority: "高", action: "FAQを20問以上に拡充", impact: "表示率+15%見込み", deadline: "9/20" },
              { priority: "中", action: "schema.org FAQPage実装", impact: "Citation率向上", deadline: "10/15" },
              { priority: "中", action: "MedicalBusiness追加", impact: "専門性評価向上", deadline: "10/31" },
            ].map((action, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-3 bg-white border border-slate-100 rounded-lg"
              >
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold flex-shrink-0 ${
                    action.priority === "高"
                      ? "bg-red-50 text-red-600"
                      : "bg-amber-50 text-amber-600"
                  }`}
                >
                  {action.priority}
                </span>
                <span className="flex-1 text-sm text-slate-700">{action.action}</span>
                <span className="text-xs text-slate-400">{action.impact}</span>
                <span className="text-xs text-slate-500 flex-shrink-0">期限: {action.deadline}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Past Reports */}
      <Card padding="none">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-700">過去のレポート</h3>
        </div>
        <div className="divide-y divide-slate-50">
          {["2026年8月", "2026年7月", "2026年6月"].map((month, i) => (
            <div
              key={month}
              className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors"
            >
              <FileText className="w-4 h-4 text-slate-400" />
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-700">
                  {month} 月次LLMOレポート
                </p>
                <p className="text-xs text-slate-400">本八幡南口接骨院</p>
              </div>
              <span className="text-sm font-semibold text-slate-600">
                {[78, 64, 58][i]}点
              </span>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors">
                <Download className="w-3 h-3" />
                PDF
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
