"use client";

import { clsx } from "clsx";

interface ScoreGaugeProps {
  score: number; // 0-100
  label?: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

function getScoreColor(score: number): string {
  if (score >= 80) return "#22c55e"; // green
  if (score >= 60) return "#3b82f6"; // blue
  if (score >= 40) return "#f59e0b"; // amber
  return "#ef4444"; // red
}

function getScoreLabel(score: number): string {
  if (score >= 80) return "優秀";
  if (score >= 60) return "良好";
  if (score >= 40) return "要改善";
  return "低調";
}

export function ScoreGauge({
  score,
  label,
  size = "md",
  showLabel = true,
}: ScoreGaugeProps) {
  const color = getScoreColor(score);
  const statusLabel = getScoreLabel(score);

  const sizeConfig = {
    sm: { radius: 36, stroke: 6, fontSize: "text-xl", labelSize: "text-xs" },
    md: {
      radius: 52,
      stroke: 8,
      fontSize: "text-3xl",
      labelSize: "text-xs",
    },
    lg: {
      radius: 72,
      stroke: 10,
      fontSize: "text-5xl",
      labelSize: "text-sm",
    },
  };

  const { radius, stroke, fontSize, labelSize } = sizeConfig[size];
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const svgSize = (radius + stroke) * 2;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative inline-flex items-center justify-center">
        <svg
          width={svgSize}
          height={svgSize}
          className="-rotate-90"
          viewBox={`0 0 ${svgSize} ${svgSize}`}
        >
          {/* Background circle */}
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={stroke}
          />
          {/* Progress circle */}
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            style={{ transition: "stroke-dashoffset 0.5s ease" }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span
            className={clsx(fontSize, "font-bold leading-none")}
            style={{ color }}
          >
            {Math.round(score)}
          </span>
          {showLabel && (
            <span className={clsx(labelSize, "text-slate-400 mt-0.5")}>
              /100
            </span>
          )}
        </div>
      </div>
      {label && (
        <div className="text-center">
          <p className="text-sm font-medium text-slate-700">{label}</p>
          <p
            className={clsx(
              labelSize,
              "font-semibold mt-0.5"
            )}
            style={{ color }}
          >
            {statusLabel}
          </p>
        </div>
      )}
    </div>
  );
}

// KPIカード
interface KpiCardProps {
  title: string;
  value: string | number;
  unit?: string;
  delta?: number | null;
  deltaLabel?: string;
  icon?: React.ReactNode;
  color?: "blue" | "green" | "amber" | "red" | "purple";
}

const colorMap = {
  blue: { bg: "bg-blue-50", text: "text-blue-600", icon: "text-blue-500" },
  green: { bg: "bg-emerald-50", text: "text-emerald-600", icon: "text-emerald-500" },
  amber: { bg: "bg-amber-50", text: "text-amber-600", icon: "text-amber-500" },
  red: { bg: "bg-red-50", text: "text-red-600", icon: "text-red-500" },
  purple: { bg: "bg-purple-50", text: "text-purple-600", icon: "text-purple-500" },
};

export function KpiCard({
  title,
  value,
  unit,
  delta,
  deltaLabel,
  icon,
  color = "blue",
}: KpiCardProps) {
  const colors = colorMap[color];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900">{value}</span>
            {unit && (
              <span className="text-sm font-medium text-slate-500">{unit}</span>
            )}
          </div>
          {delta !== null && delta !== undefined && (
            <p
              className={clsx(
                "text-xs mt-1 font-medium",
                delta >= 0 ? "text-emerald-600" : "text-red-500"
              )}
            >
              {delta >= 0 ? "↑" : "↓"} {Math.abs(delta)}
              {deltaLabel && (
                <span className="text-slate-400 font-normal ml-1">
                  {deltaLabel}
                </span>
              )}
            </p>
          )}
        </div>
        {icon && (
          <div className={clsx("w-10 h-10 rounded-lg flex items-center justify-center", colors.bg)}>
            <span className={colors.icon}>{icon}</span>
          </div>
        )}
      </div>
    </div>
  );
}
