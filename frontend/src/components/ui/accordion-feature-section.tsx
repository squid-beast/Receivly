import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export interface AccordionFeatureItem {
  id: number;
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface AccordionFeatureSectionProps {
  features?: AccordionFeatureItem[];
  /** Section class (e.g. dark theme) */
  className?: string;
}

const defaultFeatures: AccordionFeatureItem[] = [
  {
    id: 1,
    title: "Add your customer and set payment terms",
    description:
      "Store business name, email, and terms once so every invoice is consistent.",
  },
  {
    id: 2,
    title: "Create and send the invoice",
    description:
      "Enter amount and description. Receivly handles numbering, due date calculation, and delivery.",
  },
  {
    id: 3,
    title: "Track payments and automate reminders",
    description:
      "See what's sent, overdue, and paid while reminders are sent automatically until payment is confirmed.",
  },
];

export function AccordionFeatureSection({
  features = defaultFeatures,
  className,
}: AccordionFeatureSectionProps) {
  const items = features.length > 0 ? features : defaultFeatures;
  const [activeTabId, setActiveTabId] = useState<number>(items[0]?.id ?? 1);
  const activeFeature = items.find((f) => f.id === activeTabId) ?? items[0];
  const ActiveIcon = activeFeature?.icon;
  const hasAnyIcon = items.some((f) => f.icon);

  return (
    <div className={cn("py-16 sm:py-20", className)}>
      <div className="flex w-full flex-col items-start gap-12 lg:flex-row lg:gap-16">
        <div className={cn("w-full", hasAnyIcon && "lg:w-1/2")}>
          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue={`item-${items[0]?.id ?? 1}`}
            onValueChange={(value) => {
              const id = value ? parseInt(value.replace("item-", ""), 10) : items[0]?.id;
              if (id) setActiveTabId(id);
            }}
          >
            {items.map((tab) => (
              <AccordionItem
                key={tab.id}
                value={`item-${tab.id}`}
                className="border-white/10"
              >
                <AccordionTrigger
                  onClick={() => setActiveTabId(tab.id)}
                  className="cursor-pointer py-5 !no-underline transition hover:no-underline [&[data-state=open]>svg]:rotate-180"
                >
                  <div className="flex flex-1 flex-col items-center text-center">
                    <span className="block text-xs font-semibold uppercase tracking-widest text-white/40">
                      Step {String(tab.id).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "mt-1 block text-lg font-semibold sm:text-xl",
                        tab.id === activeTabId ? "text-white" : "text-white/70"
                      )}
                    >
                      {tab.title}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="mt-2 text-center text-white/60">{tab.description}</p>
                  <div className="mt-4 lg:hidden">
                    <div className="flex h-32 w-full items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
                      {tab.icon && (
                        <tab.icon className="h-12 w-12 text-primary-400" />
                      )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        {ActiveIcon && (
          <div className="relative hidden w-full overflow-hidden rounded-2xl bg-white/[0.03] ring-1 ring-white/10 lg:flex lg:min-h-[320px] lg:w-1/2 lg:items-center lg:justify-center">
            <div className="flex h-48 w-48 items-center justify-center rounded-2xl bg-primary-500/10 ring-1 ring-primary-500/20">
              <ActiveIcon className="h-20 w-20 text-primary-400" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
