import { cn } from "@/lib/utils";
import { AnimatedSection } from "./AnimatedSection";

export function SectionHeading({
  badge,
  title,
  description,
  align = "center",
  dark = false,
}: {
  badge?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  dark?: boolean;
}) {
  return (
    <AnimatedSection
      className={cn(
        "mx-auto max-w-2xl mb-14 lg:mb-16",
        align === "center" && "text-center"
      )}
    >
      {badge && (
        <span
          className={cn(
            "mb-4 inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
            dark
              ? "border-white/10 bg-white/5 text-white/80"
              : "border-primary-200 bg-primary-50 text-primary-700"
          )}
        >
          {badge}
        </span>
      )}
      <h2
        className={cn(
          "font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]",
          dark ? "text-white" : "text-foreground"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-lg leading-relaxed",
            dark ? "text-white/60" : "text-muted-foreground"
          )}
        >
          {description}
        </p>
      )}
    </AnimatedSection>
  );
}
