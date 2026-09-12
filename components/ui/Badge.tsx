import { clsx } from "clsx";

type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "blue"
  | "purple"
  | "slate";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-slate-100 text-slate-700",
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
  danger: "bg-red-50 text-red-700",
  blue: "bg-blue-50 text-blue-700",
  purple: "bg-purple-50 text-purple-700",
  slate: "bg-slate-100 text-slate-600",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

// Visibility Status用バッジ
export function VisibilityBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; variant: BadgeVariant }> = {
    NOT_MENTIONED: { label: "非表示", variant: "danger" },
    MENTIONED: { label: "言及あり", variant: "warning" },
    RECOMMENDED: { label: "推薦", variant: "blue" },
    STRONGLY_RECOMMENDED: { label: "強く推薦", variant: "success" },
  };

  const { label, variant } = config[status] ?? {
    label: status,
    variant: "default",
  };

  return <Badge variant={variant}>{label}</Badge>;
}
