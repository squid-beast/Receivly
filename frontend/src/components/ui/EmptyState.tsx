import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, children, className }: EmptyStateProps) {
  return (
    <div className={cn("rounded-xl border border-dashed border-border p-16 text-center", className)}>
      <Icon className="mx-auto h-12 w-12 text-muted-foreground/40" />
      <h2 className="mt-5 text-lg font-semibold text-foreground">{title}</h2>
      <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
      {children && <div className="mt-8">{children}</div>}
    </div>
  );
}
