import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

export interface PillTab {
  value: string;
  label: React.ReactNode;
  panel?: React.ReactNode;
}

interface PillMorphTabsProps {
  items?: PillTab[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  /** When true, panels are not rendered (e.g. for nav-only usage) */
  hidePanels?: boolean;
}

/**
 * PillMorphTabs
 *
 * - Uses shadcn Tabs primitives for accessibility.
 * - Active pill is an animated morphing element (framer-motion).
 * - Glassmorphism + subtle gradient background.
 * - Responsive and keyboard accessible (handled by Tabs).
 */
export default function PillMorphTabs({
  items = [
    { value: "overview", label: "Overview", panel: <div>Overview content</div> },
    { value: "features", label: "Features", panel: <div>Feature list</div> },
    { value: "pricing", label: "Pricing", panel: <div>Pricing & plans</div> },
    { value: "faq", label: "FAQ", panel: <div>FAQ content</div> },
  ],
  defaultValue,
  value: controlledValue,
  onValueChange,
  className,
  hidePanels = false,
}: PillMorphTabsProps) {
  const first = items[0]?.value ?? "tab-0";
  const [internalValue, setInternalValue] = React.useState<string>(
    defaultValue ?? controlledValue ?? first
  );
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const listRef = React.useRef<HTMLDivElement | null>(null);
  const triggerRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});

  const [indicator, setIndicator] = React.useState<{
    left: number;
    width: number;
  } | null>(null);
  const [isExpanding, setIsExpanding] = React.useState(false);

  const measure = React.useCallback(() => {
    const list = listRef.current;
    const activeEl = triggerRefs.current[value];
    if (!list || !activeEl) {
      setIndicator(null);
      return;
    }
    const listRect = list.getBoundingClientRect();
    const tRect = activeEl.getBoundingClientRect();
    setIndicator({
      left: tRect.left - listRect.left + list.scrollLeft,
      width: tRect.width,
    });
  }, [value]);

  React.useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (listRef.current) ro.observe(listRef.current);
    const refs = Object.values(triggerRefs.current);
    refs.forEach((el) => el && ro.observe(el));
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  React.useEffect(() => {
    setIsExpanding(true);
    const id = window.setTimeout(() => setIsExpanding(false), 300);
    return () => window.clearTimeout(id);
  }, [value]);

  const handleValueChange = React.useCallback(
    (v: string) => {
      if (!isControlled) setInternalValue(v);
      onValueChange?.(v);
    },
    [isControlled, onValueChange]
  );

  return (
    <div className={cn("w-full", className)}>
      <Tabs value={value} onValueChange={handleValueChange}>
        <div
          ref={listRef}
          className={cn(
            "relative flex w-full items-center gap-2 p-1 rounded-full",
            "bg-white/6 dark:bg-white/3 backdrop-blur-sm",
            "border border-white/10 dark:border-white/10"
          )}
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.00))",
          }}
        >
          {indicator && (
            <motion.div
              layout
              initial={false}
              animate={{
                left: indicator.left,
                width: indicator.width,
                scaleY: isExpanding ? 1.06 : 1,
                borderRadius: isExpanding ? 24 : 999,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 28,
              }}
              className="absolute pointer-events-none top-1 bottom-1 rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, rgba(124,58,237,0.18), rgba(6,182,212,0.14))",
                boxShadow: "0 6px 20px rgba(16,24,40,0.08)",
                border: "1px solid rgba(255,255,255,0.04)",
              }}
            />
          )}

          {indicator && (
            <motion.div
              layout
              initial={false}
              animate={{ left: indicator.left, width: indicator.width }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="absolute pointer-events-none top-0 bottom-0 rounded-full filter blur-2xl opacity-40"
              style={{
                background: "linear-gradient(90deg,#7c3aed,#06b6d4)",
                mixBlendMode: "screen",
              }}
            />
          )}

          <TabsList className="relative flex w-full flex-1 gap-1 p-1 bg-transparent border-0">
            {items.map((it) => {
              const isActive = it.value === value;
              return (
                <TabsTrigger
                  key={it.value}
                  value={it.value}
                  ref={(el) => {
                    triggerRefs.current[it.value] = el;
                  }}
                  onClick={() => onValueChange?.(it.value)}
                  className={cn(
                    "relative z-10 flex-1 min-w-0 px-3 py-2 rounded-full text-sm font-medium transition-colors border-0 bg-transparent shadow-none justify-center",
                    isActive
                      ? "text-white"
                      : "text-foreground/80 hover:text-foreground"
                  )}
                >
                  {it.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {!hidePanels && (
          <div className="mt-4">
            {items.map((it) => (
              <TabsContent
                key={it.value}
                value={it.value}
                className="p-2 mt-0"
              >
                {it.panel ?? null}
              </TabsContent>
            ))}
          </div>
        )}
      </Tabs>
    </div>
  );
}
