"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import {
  LayoutDashboard,
  MapPin,
  MessageSquare,
  Eye,
  Users,
  Link2,
  ClipboardCheck,
  BarChart3,
  FileText,
  Settings,
  Zap,
} from "lucide-react";

const navItems = [
  {
    label: "ダッシュボード",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "店舗管理",
    href: "/locations",
    icon: MapPin,
  },
  {
    label: "キーワード/プロンプト",
    href: "/keywords",
    icon: MessageSquare,
  },
  {
    label: "AI表示状況",
    href: "/visibility",
    icon: Eye,
  },
  {
    label: "競合分析",
    href: "/competitors",
    icon: Users,
  },
  {
    label: "Citation分析",
    href: "/citations",
    icon: Link2,
  },
  {
    label: "LLMOオーディット",
    href: "/audit",
    icon: ClipboardCheck,
  },
  {
    label: "アナリティクス",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    label: "レポート",
    href: "/reports",
    icon: FileText,
  },
  {
    label: "設定",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 min-h-screen bg-white border-r border-slate-200 flex flex-col">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 leading-none">
              LLMO Platform
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              AI Visibility Monitor
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon
                className={clsx(
                  "w-4 h-4 flex-shrink-0",
                  isActive ? "text-blue-600" : "text-slate-400"
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Phase badge */}
      <div className="px-4 py-4 border-t border-slate-100">
        <div className="bg-slate-50 rounded-lg px-3 py-2">
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">
            Phase 1 MVP
          </p>
          <p className="text-xs text-slate-600 mt-0.5">Gemini API 計測中</p>
        </div>
      </div>
    </aside>
  );
}
