"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { KpiCard } from "@/components/ui/ScoreGauge";
import { Link2, ExternalLink, CheckCircle2, Globe } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const CITATION_DOMAINS = [
  { domain: "maps.google.com", label: "Google Maps", count: 89, pct: 42, type: "GOOGLE_BUSINESS_PROFILE", isOfficial: false },
  { domain: "honhachiman-seikotsuin.com", label: "公式HP", count: 66, pct: 31, type: "OFFICIAL", isOfficial: true },
  { domain: "beauty.hotpepper.jp", label: "HotPepper Beauty", count: 30, pct: 14, type: "PORTAL", isOfficial: false },
  { domain: "epark.jp", label: "EPARK", count: 17, pct: 8, type: "PORTAL", isOfficial: false },
  { domain: "その他", label: "その他", count: 10, pct: 5, type: "OTHER", isOfficial: false },
];

const TYPE_COLORS: Record<string, string> = {
  OFFICIAL: "#3b82f6",
  GOOGLE_BUSINESS_PROFILE: "#22c55e",
  PORTAL: "#f59e0b",
  MEDIA: "#8b5cf6",
  REVIEW: "#ef4444",
  SNS: "#ec4899",
  COMPETITOR: "#f97316",
  OTHER: "#94a3b8",
};

const TYPE_LABELS: Record<string, string> = {
  OFFICIAL: "公式サイト",
  GOOGLE_BUSINESS_PROFILE: "Google Map / GBP",
  PORTAL: "ポータルサイト",
  MEDIA: "メディア",
  REVIEW: "口コミサイト",
  SNS: "SNS",
  COMPETITOR: "競合",
  OTHER: "その他",
};

const PIE_COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#8b5cf6", "#94a3b8"];

export default function CitationsPage() {
  const pieData = CITATION_DOMAINS.map((d, i) => ({
    name: d.label,
    value: d.count,
    fill: PIE_COLORS[i],
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Citation分析</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          AIがどの情報源を参照しているかを分析します
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <KpiCard
          title="Official Citation率"
          value="64"
          unit="%"
          delta={-1.5}
          deltaLabel="先週比"
          icon={<CheckCircle2 className="w-5 h-5" />}
          color="blue"
        />
        <KpiCard
          title="総Citation数"
          value="212"
          delta={18}
          deltaLabel="先週比"
          icon={<Link2 className="w-5 h-5" />}
          color="green"
        />
        <KpiCard
          title="引用ドメイン数"
          value="24"
          icon={<Globe className="w-5 h-5" />}
          color="purple"
        />
        <KpiCard
          title="公式HP引用"
          value="66"
          unit="回"
          delta={4}
          deltaLabel="先週比"
          icon={<ExternalLink className="w-5 h-5" />}
          color="amber"
        />
      </div>

      <div className="grid grid-cols-5 gap-4">
        {/* Pie Chart */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Citation ソース分布</CardTitle>
          </CardHeader>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={85}
                paddingAngle={2}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: "11px" }}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Domain Ranking */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>引用ドメイン ランキング</CardTitle>
            <span className="text-xs text-slate-400">過去30日間</span>
          </CardHeader>
          <div className="space-y-3">
            {CITATION_DOMAINS.map((d, i) => (
              <div key={d.domain} className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium text-slate-700 truncate">
                      {d.label}
                    </p>
                    {d.isOfficial && (
                      <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-medium">
                        自社
                      </span>
                    )}
                    <Badge variant="slate">
                      {TYPE_LABELS[d.type]}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">{d.domain}</p>
                  <div className="mt-1.5 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${d.pct}%`,
                        backgroundColor: PIE_COLORS[i],
                      }}
                    />
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-bold text-slate-700">{d.pct}%</p>
                  <p className="text-[10px] text-slate-400">{d.count}回</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Official Citation Rate Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Official Citation Rate 分析</CardTitle>
          <span className="text-xs text-slate-400">自社公式サイトが引用された割合</span>
        </CardHeader>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center p-6 bg-blue-50 rounded-xl">
            <p className="text-xs text-blue-600 font-medium">自社表示回数</p>
            <p className="text-3xl font-bold text-blue-700 mt-2">103</p>
            <p className="text-xs text-blue-500 mt-1">回</p>
          </div>
          <div className="text-center p-6 bg-emerald-50 rounded-xl">
            <p className="text-xs text-emerald-600 font-medium">公式HP引用回数</p>
            <p className="text-3xl font-bold text-emerald-700 mt-2">66</p>
            <p className="text-xs text-emerald-500 mt-1">回</p>
          </div>
          <div className="text-center p-6 bg-slate-50 rounded-xl">
            <p className="text-xs text-slate-600 font-medium">Official Citation Rate</p>
            <p className="text-3xl font-bold text-slate-700 mt-2">64%</p>
            <p className="text-xs text-slate-500 mt-1">= 66 ÷ 103</p>
          </div>
        </div>
        <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-100">
          <p className="text-xs text-amber-700 font-medium">
            💡 改善ポイント: 公式HPが引用されていない36回の計測では、Google MapsやEPARKが引用されています。公式HPのコンテンツ強化でCitation率の向上が期待できます。
          </p>
        </div>
      </Card>
    </div>
  );
}
