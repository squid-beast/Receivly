import { motion } from "framer-motion";
import { FileText, BellRing, LayoutDashboard, Users, CheckCircle2, Shield } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  SECTION_PADDING,
  SECTION_SCROLL_MARGIN,
} from "@/components/landing/landing-section";
import { cn } from "@/lib/utils";

/** Minimal accent colors: icon bg + icon color (light/dark friendly) */
const featureColors = [
  { iconBg: "bg-indigo-100 dark:bg-indigo-950/50", icon: "text-indigo-600 dark:text-indigo-400" },
  { iconBg: "bg-emerald-100 dark:bg-emerald-950/50", icon: "text-emerald-600 dark:text-emerald-400" },
  { iconBg: "bg-amber-100 dark:bg-amber-950/50", icon: "text-amber-600 dark:text-amber-400" },
  { iconBg: "bg-violet-100 dark:bg-violet-950/50", icon: "text-violet-600 dark:text-violet-400" },
  { iconBg: "bg-sky-100 dark:bg-sky-950/50", icon: "text-sky-600 dark:text-sky-400" },
  { iconBg: "bg-rose-100 dark:bg-rose-950/50", icon: "text-rose-600 dark:text-rose-400" },
] as const;

const accentHoverClasses = [
  "hover:border-indigo-500 hover:ring-indigo-500/70",
  "hover:border-emerald-500 hover:ring-emerald-500/70",
  "hover:border-amber-500 hover:ring-amber-500/70",
  "hover:border-violet-500 hover:ring-violet-500/70",
  "hover:border-sky-500 hover:ring-sky-500/70",
  "hover:border-rose-500 hover:ring-rose-500/70",
] as const;

const keyFeatures = [
  {
    title: "Create Invoices in 60 Seconds",
    summary:
      "Add your customer once. Generate invoices instantly with auto-numbering, auto-calculated due dates, and professional formatting. No templates to wrestle with.",
    icon: FileText,
  },
  {
    title: "See Every Invoice Status at a Glance",
    summary:
      "Your receivables dashboard shows every invoice organized as Sent, Overdue, or Paid. Know exactly how much money is outstanding at any moment.",
    icon: BellRing,
  },
  {
    title: "Stop Chasing. Start Automating.",
    summary:
      "Receivly sends payment reminders automatically at 7, 14, and 21 days after the due date. No more manual follow-up emails. No more forgotten invoices.",
    icon: LayoutDashboard,
  },
  {
    title: "Customer Management",
    summary:
      "Keep names, emails, and default payment terms in one place. Add once and reuse on every invoice with no duplicate data entry.",
    icon: Users,
  },
  {
    title: "Payment Tracking",
    summary:
      "Mark invoices as paid in one click. No bank connection required. Clear status and accurate records for your books.",
    icon: CheckCircle2,
  },
  {
    title: "Security & Data",
    summary:
      "Your data stays in your own workspace. It’s isolated and secure, and we store only what’s needed to run your invoicing.",
    icon: Shield,
  },
] as const;

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: i * 0.06,
      ease: [0.21, 0.47, 0.32, 0.98] as const,
    },
  }),
};

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof keyFeatures)[number];
  index: number;
}) {
  const Icon = feature.icon;
  const colors = featureColors[index % featureColors.length];
  return (
    <motion.article
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-24px" }}
      custom={index}
      className={cn(
        "relative flex h-full flex-col rounded-2xl border border-border/70 bg-gradient-to-b from-background/95 to-muted/40 p-6 shadow-sm ring-1 ring-border/40 transition-all duration-300 hover:shadow-lg",
        accentHoverClasses[index % accentHoverClasses.length]
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
            colors.iconBg,
            colors.icon
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="font-display text-base font-semibold text-foreground">
          {feature.title}
        </h3>
      </div>
      <p className="mt-3 text-base leading-relaxed text-muted-foreground">
        {feature.summary}
      </p>
    </motion.article>
  );
}

export function Features() {
  return (
    <section id="features" className={cn(SECTION_PADDING, SECTION_SCROLL_MARGIN)}>
      <Container>
        <SectionHeading
          title="Key Features"
          description="Everything you need to send invoices, track payments, and get paid on time without the spreadsheets."
          align="center"
        />
        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {keyFeatures.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
}
