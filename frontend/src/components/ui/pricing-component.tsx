import { useState } from "react";
import { Check } from "lucide-react";

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const plans = [
    {
      tag: undefined,
      name: "Starter",
      description: "Just getting started",
      priceMonthly: "$0/mo",
      priceAnnual: "$0/yr",
      priceMetaMonthly: "Free forever",
      priceMetaAnnual: "Free forever",
      contactEmail: undefined,
      features: [
        "Up to 5 customers",
        "Up to 10 invoices/mo",
        "Basic dashboard",
        "Manual reminders only",
        "Receivly branding on invoices",
      ],
      cta: "Get Started",
      highlighted: false,
    },
    {
      tag: undefined,
      name: "Solo",
      description: "Freelancers & contractors",
      priceMonthly: "$7/mo",
      priceAnnual: "$59/yr",
      priceMetaMonthly: "$59/yr — save 30%",
      priceMetaAnnual: "Save 30% vs monthly",
      contactEmail: undefined,
      features: [
        "Unlimited customers",
        "Unlimited invoices",
        "Automated reminders",
        "Weekly cash flow summary",
        "Overdue tracking dashboard",
        "Receivly branding on invoices",
      ],
      cta: "Upgrade to Pro",
      highlighted: true,
    },
    {
      tag: undefined,
      name: "Micro",
      description: "Small agencies & teams (2-10)",
      priceMonthly: "$16/mo",
      priceAnnual: "$129/yr",
      priceMetaMonthly: "$129/yr — save 33%",
      priceMetaAnnual: "Save 33% vs monthly",
      contactEmail: "founder@getreceivly.com",
      features: [
        "Everything in Solo",
        "Up to 5 team members",
        "Shared customer workspace",
        "Priority support",
        "Receivly branding on invoices",
      ],
      cta: "Contact sales",
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="bg-white dark:bg-black mt-14 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black dark:text-white mb-4 tracking-tight">
            Plans and Pricing
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-6">
            Receive unlimited credits when you pay yearly, and save on your plan
          </p>

          <div className="inline-flex items-center bg-black/[0.03] dark:bg-white/[0.03] rounded-full p-1">
            <button
              type="button"
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-colors ${
                !isAnnual
                  ? "bg-black/[0.07] dark:bg-white/[0.07] text-black dark:text-white"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
              }`}
              onClick={() => setIsAnnual(false)}
            >
              Monthly
            </button>
            <button
              type="button"
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-colors ${
                isAnnual
                  ? "bg-black/[0.07] dark:bg-white/[0.07] text-black dark:text-white"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
              }`}
              onClick={() => setIsAnnual(true)}
            >
              Annual
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border ${
                plan.highlighted
                  ? "border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] scale-[1.02] shadow-xl"
                  : "border-black/[0.08] dark:border-white/[0.08] hover:border-black/10 dark:hover:border-white/10"
              } p-6 transition-all duration-300`}
            >
              {plan.tag && (
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1 rounded-full bg-black/[0.03] dark:bg-white/[0.03] px-4 py-1 text-xs font-medium text-black/70 dark:text-white/70 backdrop-blur-sm border border-black/10 dark:border-white/10">
                    {plan.tag}
                  </span>
                </div>
              )}

              {plan.highlighted && plan.tag === "Most Popular" && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="relative">
                    <div className="absolute inset-0 bg-black/10 dark:bg-white/10 rounded-full blur-[2px]" />

                    <div className="relative px-4 py-1.5 bg-black/[0.03] dark:bg-white/[0.03] backdrop-blur-sm rounded-full border border-black/10 dark:border-white/10">
                      <div className="flex items-center gap-1.5">
                        <span className="inline-block w-1 h-1 rounded-full bg-black/60 dark:bg-white/60 animate-pulse" />
                        <span className="text-xs font-medium text-black/80 dark:text-white/80">
                          Most Popular
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-medium text-black dark:text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-0">
                  {plan.description}
                </p>
                <div className="flex flex-col gap-1">
                  <span className="text-4xl font-bold text-black dark:text-white">
                    {isAnnual ? plan.priceAnnual : plan.priceMonthly}
                  </span>
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    {isAnnual ? plan.priceMetaAnnual : plan.priceMetaMonthly}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-black/30 dark:text-white/30" />
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className={`w-full py-2.5 px-4 rounded-xl text-sm font-medium transition-colors ${
                  plan.highlighted
                    ? "bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90"
                    : "border border-black/10 dark:border-white/10 text-black dark:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.03]"
                }`}
                onClick={() => {
                  if (!plan.contactEmail) return;
                  window.location.href = `mailto:${plan.contactEmail}`;
                }}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;

