import { cn } from "@/lib/utils";
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
    <div className="rounded-lg border border-border bg-background p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg",
            iconClassName || "bg-primary/10"
          )}
        >
          <Icon
            className={cn(
              "h-4 w-4",
              iconClassName ? "text-current" : "text-primary"
            )}
          />
        </div>
      </div>
      <p
        className={cn(
          "mt-3 font-display text-2xl font-bold text-foreground",
          valueClassName
        )}
      >
        {value}
      </p>
      <div className="mt-1 flex items-center gap-2">
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
        {trend && (
          <span
            className={cn(
              "text-xs font-medium",
              trend.positive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            )}
          >
            {trend.positive ? "+" : ""}{trend.value}
          </span>
        )}
      </div>
    </div>
  );
}
