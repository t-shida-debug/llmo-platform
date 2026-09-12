"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Key, CheckCircle2, XCircle, DollarSign, Bell, Clock } from "lucide-react";

export default function SettingsPage() {
  const [geminiKey, setGeminiKey] = useState("AIza••••••••••••••••••••••••••••");
  const [openaiKey, setOpenaiKey] = useState("");
  const [perplexityKey, setPerplexityKey] = useState("");

  const providers = [
    {
      name: "Google Gemini",
      type: "GEMINI",
      model: "gemini-1.5-pro",
      apiKey: geminiKey,
      setApiKey: setGeminiKey,
      available: true,
      monthlyReq: 1_240,
      monthlyTokens: 4_800_000,
      monthlyCost: 16.80,
      color: "text-blue-600",
    },
    {
      name: "ChatGPT (OpenAI)",
      type: "OPENAI",
      model: "gpt-4o",
      apiKey: openaiKey,
      setApiKey: setOpenaiKey,
      available: false,
      monthlyReq: 0,
      monthlyTokens: 0,
      monthlyCost: 0,
      color: "text-emerald-600",
    },
    {
      name: "Perplexity AI",
      type: "PERPLEXITY",
      model: "sonar-large",
      apiKey: perplexityKey,
      setApiKey: setPerplexityKey,
      available: false,
      monthlyReq: 0,
      monthlyTokens: 0,
      monthlyCost: 0,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">設定</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          API設定・計測スケジュール・通知設定
        </p>
      </div>

      {/* API Keys */}
      <Card>
        <CardHeader>
          <CardTitle>AI プロバイダー設定</CardTitle>
        </CardHeader>
        <div className="space-y-6">
          {providers.map((provider) => (
            <div key={provider.type} className="border border-slate-100 rounded-xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div>
                    <p className={`text-sm font-semibold ${provider.color}`}>
                      {provider.name}
                    </p>
                    <p className="text-xs text-slate-400">{provider.model}</p>
                  </div>
                </div>
                {provider.available ? (
                  <Badge variant="success">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    接続済
                  </Badge>
                ) : (
                  <Badge variant="default">
                    <XCircle className="w-3 h-3 mr-1" />
                    未設定
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <input
                  type="password"
                  value={provider.apiKey}
                  onChange={(e) => provider.setApiKey(e.target.value)}
                  placeholder={`${provider.name} APIキーを入力`}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  保存
                </button>
              </div>

              {provider.available && (
                <div className="grid grid-cols-3 gap-3 mt-3">
                  <div className="text-center p-2 bg-slate-50 rounded-lg">
                    <p className="text-[10px] text-slate-400">今月リクエスト数</p>
                    <p className="text-sm font-bold text-slate-700 mt-0.5">
                      {provider.monthlyReq.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center p-2 bg-slate-50 rounded-lg">
                    <p className="text-[10px] text-slate-400">今月トークン数</p>
                    <p className="text-sm font-bold text-slate-700 mt-0.5">
                      {(provider.monthlyTokens / 1_000_000).toFixed(1)}M
                    </p>
                  </div>
                  <div className="text-center p-2 bg-slate-50 rounded-lg">
                    <p className="text-[10px] text-slate-400">今月コスト</p>
                    <p className="text-sm font-bold text-slate-700 mt-0.5">
                      ${provider.monthlyCost.toFixed(2)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* API Cost Limit */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            APIコスト上限設定
          </CardTitle>
        </CardHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="text-sm text-slate-600 w-32">月次上限</label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">$</span>
              <input
                type="number"
                defaultValue={50}
                className="w-24 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-400">/ 月</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="text-sm text-slate-600 w-32">日次上限</label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">$</span>
              <input
                type="number"
                defaultValue={5}
                className="w-24 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-400">/ 日</span>
            </div>
          </div>
          <div className="flex justify-end">
            <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
              保存
            </button>
          </div>
        </div>
      </Card>

      {/* Measurement Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            計測スケジュール
          </CardTitle>
        </CardHeader>
        <div className="space-y-4">
          {[
            { freq: "毎日", desc: "重要度5のプロンプト（daily設定）", count: 4, time: "06:00 JST" },
            { freq: "週1", desc: "重要度3-4のプロンプト（weekly設定）", count: 12, time: "月曜 06:00 JST" },
            { freq: "月1", desc: "通常プロンプト（monthly設定）", count: 8, time: "毎月1日 06:00 JST" },
          ].map((s) => (
            <div
              key={s.freq}
              className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl"
            >
              <Badge variant={s.freq === "毎日" ? "danger" : s.freq === "週1" ? "warning" : "default"}>
                {s.freq}
              </Badge>
              <div className="flex-1">
                <p className="text-sm text-slate-700">{s.desc}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  対象: {s.count}プロンプト — 実行時刻: {s.time}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600" />
              </label>
            </div>
          ))}
        </div>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            アラート通知設定
          </CardTitle>
        </CardHeader>
        <div className="space-y-3">
          {[
            { label: "AI表示消失", desc: "突然非表示になった場合", enabled: true },
            { label: "順位急落（2位以上降下）", desc: "前回比2位以上の降下", enabled: true },
            { label: "Negativeコメント増加", desc: "Sentimentが-20以下", enabled: true },
            { label: "競合急上昇", desc: "競合のSOVが10%以上急増", enabled: false },
            { label: "Citation消失", desc: "公式Citation率が30%以下", enabled: false },
            { label: "LLMOスコア低下", desc: "スコアが10ポイント以上低下", enabled: true },
          ].map((n) => (
            <div
              key={n.label}
              className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0"
            >
              <div>
                <p className="text-sm font-medium text-slate-700">{n.label}</p>
                <p className="text-xs text-slate-400">{n.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={n.enabled}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600" />
              </label>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-500 font-medium mb-2">通知先</p>
          <input
            type="email"
            defaultValue="t-shida@keizgroup.jp"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </Card>
    </div>
  );
}
