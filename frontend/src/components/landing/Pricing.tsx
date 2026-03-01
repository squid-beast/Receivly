import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { SECTION_PADDING, SECTION_SCROLL_MARGIN } from "@/components/landing/landing-section";
import { cn } from "@/lib/utils";

type BillingPeriod = "monthly" | "yearly";

// PRO: $9/month → $108/year. ELITE: $19/month → $228/year.
const PRO_MONTHLY = 9;
const PRO_YEARLY = PRO_MONTHLY * 12; // 108
const ELITE_MONTHLY = 19;
const ELITE_YEARLY = ELITE_MONTHLY * 12; // 228

type PlanId = "free" | "pro" | "elite";

const plans: Array<{
  id: PlanId;
  name: string;
  description: string | null;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  cta: string;
  buttonVariant: "secondary" | "default" | "outline";
  contactSales?: boolean;
}> = [
  {
    id: "free",
    name: "Free",
    description: "For solo founders getting started",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      "Basic invoicing",
      "Customer management",
      "Manual payment tracking",
    ],
    cta: "Get started",
    buttonVariant: "secondary",
  },
  {
    id: "pro",
    name: "PRO",
    description: null,
    monthlyPrice: PRO_MONTHLY,
    yearlyPrice: PRO_YEARLY,
    features: [
      "Everything in Free",
      "Automatic reminders",
      "Weekly summary emails",
      "Advanced dashboard tracking",
    ],
    cta: "Get started",
    buttonVariant: "default",
  },
  {
    id: "elite",
    name: "ELITE",
    description: null,
    monthlyPrice: ELITE_MONTHLY,
    yearlyPrice: ELITE_YEARLY,
    features: [
      "Everything in PRO",
      "Priority reminder scheduling",
      "Exportable invoice records",
      "Multi-user access (future-ready)",
    ],
    cta: "Contact sales",
    buttonVariant: "outline",
    contactSales: true,
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.12, ease: [0.21, 0.47, 0.32, 0.98] as const },
  }),
};

const SUPPORT_EMAIL = "startwithleo@gmail.com";

export function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");
  const [selectedPlan, setSelectedPlan] = useState<PlanId>("pro");

  return (
    <section id="pricing" className={cn(SECTION_PADDING, SECTION_SCROLL_MARGIN)}>
      <Container>
        <SectionHeading
          title="Pricing"
          description="Use for free with your whole team. Upgrade to enable unlimited invoices, automatic reminders, and additional features."
        />

        <div className="mx-auto flex justify-center">
          <div className="inline-flex items-center gap-1 rounded-lg border border-border bg-muted/30 p-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setBillingPeriod("monthly")}
              className={cn(
                "min-h-[44px] rounded-md px-4 py-3 text-sm font-medium transition-colors sm:py-2",
                billingPeriod === "monthly"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBillingPeriod("yearly")}
              className={cn(
                "min-h-[44px] rounded-md px-4 py-3 text-sm font-medium transition-colors sm:py-2",
                billingPeriod === "yearly"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Billed annually
            </button>
          </div>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              role="button"
              tabIndex={0}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              onClick={() => setSelectedPlan(plan.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedPlan(plan.id);
                }
              }}
              className={cn(
                "relative cursor-pointer rounded-2xl border border-border bg-background p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-lg",
                selectedPlan === plan.id
                  ? "border-2 border-foreground ring-2 ring-foreground/10"
                  : "border border-border"
              )}
            >
              <h3 className="text-lg font-semibold text-foreground">
                {plan.name}
              </h3>

              <div className="mt-4">
                {plan.monthlyPrice === 0 ? (
                  <>
                    <span className="font-display text-3xl font-bold text-foreground">
                      $0
                    </span>
                    {plan.description && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {plan.description}
                      </p>
                    )}
                  </>
                ) : billingPeriod === "monthly" ? (
                  <>
                    <span className="font-display text-3xl font-bold text-foreground">
                      ${plan.monthlyPrice}
                    </span>
                    <p className="mt-1 text-sm text-muted-foreground">
                      per month
                    </p>
                  </>
                ) : (
                  <>
                    <span className="font-display text-3xl font-bold text-foreground">
                      ${plan.yearlyPrice}
                    </span>
                    <p className="mt-1 text-sm text-muted-foreground">
                      per year
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground/80">
                      Billed annually
                    </p>
                  </>
                )}
              </div>

              <ul className="mt-8 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>

              {plan.contactSales ? (
                <a
                  href={`mailto:${SUPPORT_EMAIL}?subject=ELITE%20plan%20inquiry`}
                  className={cn(
                    "mt-8 flex w-full items-center justify-center rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  )}
                  onClick={(e) => e.stopPropagation()}
                >
                  {plan.cta}
                </a>
              ) : (
                <Button
                  variant={plan.buttonVariant}
                  className={cn(
                    "mt-8 w-full",
                    plan.buttonVariant === "default" &&
                      "bg-foreground text-background hover:bg-foreground/90"
                  )}
                  onClick={(e) => e.stopPropagation()}
                >
                  {plan.cta}
                </Button>
              )}
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
