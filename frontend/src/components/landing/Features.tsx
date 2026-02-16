import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  BellRing,
  LayoutDashboard,
  Users,
  CheckCircle2,
  Shield,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SECTION_PADDING, SECTION_HEADING_MB, CARD_CLASS } from "@/components/landing/landing-section";
import { cn } from "@/lib/utils";

const keyFeatures = [
  {
    title: "Invoicing",
    description:
      "Create and send professional invoices in under a minute. No spreadsheets or complicated forms—just amount, description, and due date.",
    linkLabel: "Learn More",
    linkHref: "#",
    icon: FileText,
    subFeatures: [
      {
        title: "Simple creation",
        description:
          "Enter amount and description. Receivly handles numbering, due date calculation, and delivery.",
      },
      {
        title: "Payment terms",
        description:
          "Set Net 7, Net 14, or Net 30 per customer so every invoice follows your terms automatically.",
      },
      {
        title: "Professional layout",
        description:
          "Clean, branded invoices that look credible and are easy for your customers to pay.",
      },
    ],
  },
  {
    title: "Reminders",
    description:
      "Automatic follow-up emails based on due dates. You stay on top of receivables without chasing anyone manually.",
    linkLabel: "Learn More",
    linkHref: "#",
    icon: BellRing,
    subFeatures: [
      {
        title: "Automatic scheduling",
        description:
          "Reminders are sent automatically based on invoice due dates unless you pause them.",
      },
      {
        title: "Weekly summary",
        description:
          "Get a simple email snapshot of what’s sent, what’s overdue, and what’s been paid.",
      },
      {
        title: "You stay in control",
        description:
          "Pause or adjust reminders anytime. No surprise emails to your customers.",
      },
    ],
  },
  {
    title: "Dashboard",
    description:
      "See all your invoices in one place: sent, overdue, and paid. Know who owes you money without opening spreadsheets.",
    linkLabel: "Learn More",
    linkHref: "#",
    icon: LayoutDashboard,
    subFeatures: [
      {
        title: "Clear status view",
        description:
          "The dashboard separates sent, overdue, and paid invoices so you can act on what matters.",
      },
      {
        title: "Customer overview",
        description:
          "See which customers have open or overdue invoices at a glance.",
      },
    ],
  },
  {
    title: "Customer Management",
    description:
      "Keep customer names, emails, and default payment terms in one place. Reuse them on every invoice so you never retype the same details.",
    linkLabel: "Learn More",
    linkHref: "#",
    icon: Users,
    subFeatures: [
      {
        title: "One place for contacts",
        description:
          "Add customers once and select them when creating invoices. No duplicate data entry.",
      },
      {
        title: "Default payment terms",
        description:
          "Assign Net 7, Net 14, or Net 30 per customer so new invoices pick the right due date automatically.",
      },
      {
        title: "Consistent billing",
        description:
          "Same details on every invoice for the same customer—professional and accurate.",
      },
    ],
  },
  {
    title: "Payment Tracking",
    description:
      "Mark invoices as paid when you get the money. Your dashboard and records stay accurate so you always know what's still outstanding.",
    linkLabel: "Learn More",
    linkHref: "#",
    icon: CheckCircle2,
    subFeatures: [
      {
        title: "Mark as paid",
        description:
          "One click to record payment. No bank connection required—manual tracking that fits how you work.",
      },
      {
        title: "Status at a glance",
        description:
          "Sent, overdue, and paid are clearly separated so you can focus on what needs follow-up.",
      },
      {
        title: "Accurate records",
        description:
          "Keep a clear history of what was sent and when it was paid for your own books and reporting.",
      },
    ],
  },
  {
    title: "Security & Data",
    description:
      "Your business data stays isolated in your own workspace. We don't mix it with other users and we store only what's needed to run your invoicing.",
    linkLabel: "Learn More",
    linkHref: "#about",
    icon: Shield,
    subFeatures: [
      {
        title: "Isolated workspaces",
        description:
          "Each business has its own workspace. Your customers and invoices are never visible to others.",
      },
      {
        title: "Data you control",
        description:
          "We store only what's required for invoices and reminders. You own your data and can use it within the product.",
      },
      {
        title: "Secure by design",
        description:
          "Built with security in mind so you can trust Receivly with your receivables and customer information.",
      },
    ],
  },
];

const CARDS_PER_PAGE = 3;
const totalPages = Math.ceil(keyFeatures.length / CARDS_PER_PAGE);

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] as const },
  },
};

function FeatureCard({
  feature,
  variants,
}: {
  feature: (typeof keyFeatures)[0];
  variants: typeof cardVariants;
}) {
  const Icon = feature.icon;
  return (
    <motion.article
      variants={variants}
      className={cn("flex h-full flex-col", CARD_CLASS)}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted/60 text-foreground">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">
          {feature.title}
        </h3>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        {feature.description}
      </p>
      <a
        href={feature.linkHref}
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary-600"
      >
        {feature.linkLabel}
        <ArrowRight className="h-4 w-4" />
      </a>
      <ul className="mt-6 space-y-5 border-t border-border pt-6">
        {feature.subFeatures.map((sub) => (
          <li key={sub.title}>
            <h4 className="text-sm font-semibold text-foreground">
              {sub.title}
            </h4>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground/90">
              {sub.description}
            </p>
          </li>
        ))}
      </ul>
    </motion.article>
  );
}

export function Features() {
  const [page, setPage] = useState(0);
  const canGoPrev = page > 0;
  const canGoNext = page < totalPages - 1;

  return (
    <section id="features" className={SECTION_PADDING}>
      <Container>
        <motion.div
          className={cn("flex flex-wrap items-end justify-between gap-4", SECTION_HEADING_MB)}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <div>
            <span className="mb-4 inline-flex items-center rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 dark:border-white/10 dark:bg-white/5 dark:text-white/80">
              Features
            </span>
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
              Key Features
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous features"
              disabled={!canGoPrev}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-border bg-muted/40 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40 sm:h-9 sm:w-9 sm:min-h-0 sm:min-w-0"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next features"
              disabled={!canGoNext}
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-border bg-muted/40 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40 sm:h-9 sm:w-9 sm:min-h-0 sm:min-w-0"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </motion.div>

        <div className="overflow-hidden">
          <motion.div
            className="flex"
            style={{ width: `${totalPages * 100}%` }}
            animate={{ x: `${-page * (100 / totalPages)}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {Array.from({ length: totalPages }).map((_, pageIndex) => (
              <div
                key={pageIndex}
                className="grid flex-shrink-0 grid-cols-1 gap-8 md:grid-cols-3"
                style={{ width: `${100 / totalPages}%` }}
              >
                {keyFeatures
                  .slice(
                    pageIndex * CARDS_PER_PAGE,
                    pageIndex * CARDS_PER_PAGE + CARDS_PER_PAGE
                  )
                  .map((feature) => (
                    <FeatureCard
                      key={feature.title}
                      feature={feature}
                      variants={cardVariants}
                    />
                  ))}
              </div>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
