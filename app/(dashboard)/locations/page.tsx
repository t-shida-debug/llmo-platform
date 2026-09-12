"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ScoreGauge } from "@/components/ui/ScoreGauge";
import { Plus, Search, MapPin, ExternalLink, TrendingUp, TrendingDown } from "lucide-react";

const DEMO_LOCATIONS = [
  {
    id: "1",
    name: "本八幡南口接骨院",
    brand: "本八幡南口接骨院",
    prefecture: "千葉県",
    city: "市川市",
    address: "千葉県市川市本八幡3-1-1",
    llmoScore: 78,
    delta: 14,
    visibilityRate: 72,
    avgRank: 1.8,
    isActive: true,
  },
  {
    id: "2",
    name: "クラシオン整骨院 下北沢院",
    brand: "クラシオン整骨院",
    prefecture: "東京都",
    city: "世田谷区",
    address: "東京都世田谷区北沢2-12-3",
    llmoScore: 67,
    delta: -3,
    visibilityRate: 61,
    avgRank: 3.2,
    isActive: true,
  },
  {
    id: "3",
    name: "クラシオン整骨院 三軒茶屋院",
    brand: "クラシオン整骨院",
    prefecture: "東京都",
    city: "世田谷区",
    address: "東京都世田谷区太子堂4-1-1",
    llmoScore: 54,
    delta: 6,
    visibilityRate: 48,
    avgRank: 4.1,
    isActive: true,
  },
];

export default function LocationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);

  const filtered = DEMO_LOCATIONS.filter(
    (l) =>
      l.name.includes(searchQuery) ||
      l.city.includes(searchQuery) ||
      l.brand.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">店舗管理</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            全 {DEMO_LOCATIONS.length} 店舗
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          店舗追加
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="店舗名・エリアで検索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Location Cards Grid */}
      <div className="grid grid-cols-3 gap-4">
        {filtered.map((location) => (
          <Card key={location.id} padding="none" className="hover:shadow-md transition-shadow cursor-pointer">
            <div className="p-5">
              {/* Top: Score + Status */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs text-slate-400 font-medium">{location.brand}</p>
                  <h3 className="text-sm font-bold text-slate-900 mt-0.5 leading-snug">
                    {location.name}
                  </h3>
                  <p className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                    <MapPin className="w-3 h-3" />
                    {location.city}
                  </p>
                </div>
                <ScoreGauge score={location.llmoScore} size="sm" showLabel={false} />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 py-3 border-t border-slate-50">
                <div className="text-center">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide">LLMO</p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">{location.llmoScore}</p>
                  <p className={`text-[10px] font-medium ${location.delta >= 0 ? "text-emerald-500" : "text-red-400"}`}>
                    {location.delta >= 0 ? "↑" : "↓"}{Math.abs(location.delta)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide">表示率</p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">{location.visibilityRate}%</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide">平均順位</p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">{location.avgRank}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2">
                <button className="flex-1 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors">
                  詳細
                </button>
                <button className="flex-1 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 rounded-md hover:bg-slate-100 transition-colors">
                  計測実行
                </button>
                <button className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Summary Table */}
      <Card padding="none">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-700">全店舗一覧</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide px-6 py-3">店舗名</th>
                <th className="text-center text-[11px] font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">LLMO</th>
                <th className="text-center text-[11px] font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">表示率</th>
                <th className="text-center text-[11px] font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">平均順位</th>
                <th className="text-center text-[11px] font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">前月比</th>
                <th className="text-center text-[11px] font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">ステータス</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {DEMO_LOCATIONS.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3">
                    <p className="text-sm font-medium text-slate-800">{l.name}</p>
                    <p className="text-xs text-slate-400">{l.prefecture} {l.city}</p>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm font-bold text-slate-800">{l.llmoScore}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm text-slate-700">{l.visibilityRate}%</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm text-slate-700">{l.avgRank}位</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`flex items-center justify-center gap-1 text-xs font-semibold ${l.delta >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                      {l.delta >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {l.delta >= 0 ? "+" : ""}{l.delta}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={l.isActive ? "success" : "default"}>
                      {l.isActive ? "計測中" : "停止"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
