import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface MetricsCardProps {
  label: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  iconClassName?: string;
  valueClassName?: string;
  trend?: { value: string; positive: boolean };
}

export function MetricsCard({
  label,
  value,
  subtitle,
  icon: Icon,
  iconClassName,
  valueClassName,
  trend,
}: MetricsCardProps) {
  return (
    <div className="rounded-xl border border-border bg-background p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg",
            iconClassName || "bg-primary/10"
          )}
        >
          <Icon className="h-4.5 w-4.5 text-current" />
        </div>
      </div>
      <p
        className={cn(
          "mt-3 font-display text-2xl font-bold tracking-tight text-foreground",
          valueClassName
        )}
      >
        {value}
      </p>
      <div className="mt-1.5 flex items-center gap-2">
        {trend && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-xs font-semibold",
              trend.positive
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-red-600 dark:text-red-400"
            )}
          >
            {trend.positive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {trend.value}
          </span>
        )}
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
