import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

const STATUS_MAP: Record<
  string,
  { label: string; icon: typeof Clock; className: string }
> = {
  SENT: {
    label: "Sent",
    icon: Clock,
    className:
      "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
  },
  PENDING: {
    label: "Pending",
    icon: Clock,
    className:
      "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400",
  },
  OVERDUE: {
    label: "Overdue",
    icon: AlertCircle,
    className:
      "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400",
  },
  PAID: {
    label: "Paid",
    icon: CheckCircle2,
    className:
      "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400",
  },
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_MAP[status] || STATUS_MAP.SENT;
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.className,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}
