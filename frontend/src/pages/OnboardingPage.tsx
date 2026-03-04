import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  Clock,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

const CURRENCIES = [
  { code: "USD", label: "US Dollar", symbol: "$" },
  { code: "EUR", label: "Euro", symbol: "€" },
  { code: "GBP", label: "British Pound", symbol: "£" },
  { code: "INR", label: "Indian Rupee", symbol: "₹" },
  { code: "CAD", label: "Canadian Dollar", symbol: "C$" },
  { code: "AUD", label: "Australian Dollar", symbol: "A$" },
];

const PAYMENT_TERMS = [
  { value: "NET_7", label: "Net 7", description: "Due within 7 days" },
  { value: "NET_14", label: "Net 14", description: "Due within 14 days" },
  { value: "NET_30", label: "Net 30", description: "Due within 30 days" },
  { value: "NET_60", label: "Net 60", description: "Due within 60 days" },
];

const STEPS = [
  { title: "Currency", icon: DollarSign },
  { title: "Payment Terms", icon: Clock },
  { title: "Timezone", icon: Globe },
  { title: "All Set", icon: CheckCircle2 },
] as const;

const TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Kolkata",
  "Asia/Dubai",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
  }),
};

export function OnboardingPage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [currency, setCurrency] = useState("USD");
  const [paymentTerms, setPaymentTerms] = useState("NET_30");
  const [timezone, setTimezone] = useState(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    } catch {
      return "UTC";
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const goNext = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleComplete = async () => {
    setError(null);
    setLoading(true);
    try {
      await api.patch("/workspaces/onboarding", {
        currency,
        defaultPaymentTerms: paymentTerms,
        timezone,
      });
      updateUser({ onboardingCompleted: true });
      navigate("/dashboard");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || "Something went wrong.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Container className="flex flex-1 flex-col items-center justify-center py-12">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="mb-8 text-center">
            <p className="text-lg font-bold font-display text-foreground">
              Receivly
            </p>
            <h1 className="mt-4 font-display text-2xl font-bold text-foreground sm:text-3xl">
              Set up your workspace
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Hi {user?.fullName?.split(" ")[0]}, let&apos;s configure{" "}
              <span className="font-medium text-foreground">
                {user?.businessName}
              </span>
              .
            </p>
          </div>

          {/* Step indicators */}
          <div className="mb-8 flex items-center justify-center gap-2">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const isActive = i === step;
              const isDone = i < step;
              return (
                <div key={s.title} className="flex items-center gap-2">
                  {i > 0 && (
                    <div
                      className={cn(
                        "h-px w-8 transition-colors",
                        isDone ? "bg-foreground" : "bg-border"
                      )}
                    />
                  )}
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full border transition-all",
                      isActive
                        ? "border-foreground bg-foreground text-background"
                        : isDone
                          ? "border-foreground bg-foreground/10 text-foreground"
                          : "border-border text-muted-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Step content */}
          <div className="relative overflow-hidden rounded-2xl border border-border bg-background p-8 shadow-sm">
            <AnimatePresence mode="wait" custom={direction}>
              {step === 0 && (
                <motion.div
                  key="currency"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] as const }}
                >
                  <h2 className="text-lg font-semibold text-foreground">
                    Default currency
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    This will be used on all new invoices. You can change it
                    later in settings.
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {CURRENCIES.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => setCurrency(c.code)}
                        className={cn(
                          "flex flex-col items-center gap-1 rounded-xl border p-4 text-sm transition-all",
                          currency === c.code
                            ? "border-foreground bg-foreground/5 ring-1 ring-foreground/10"
                            : "border-border hover:border-muted-foreground/40"
                        )}
                      >
                        <span className="text-lg font-semibold text-foreground">
                          {c.symbol}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {c.code}
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="terms"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] as const }}
                >
                  <h2 className="text-lg font-semibold text-foreground">
                    Default payment terms
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    How many days customers have to pay. You can override this
                    per customer.
                  </p>
                  <div className="mt-6 space-y-3">
                    {PAYMENT_TERMS.map((t) => (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => setPaymentTerms(t.value)}
                        className={cn(
                          "flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all",
                          paymentTerms === t.value
                            ? "border-foreground bg-foreground/5 ring-1 ring-foreground/10"
                            : "border-border hover:border-muted-foreground/40"
                        )}
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
                          <Clock className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {t.label}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {t.description}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="timezone"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] as const }}
                >
                  <h2 className="text-lg font-semibold text-foreground">
                    Timezone
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Used for due dates and reminder times. You can change it
                    later in settings.
                  </p>
                  <div className="mt-6 space-y-2 max-h-64 overflow-y-auto pr-1">
                    {TIMEZONES.map((tz) => (
                      <button
                        key={tz}
                        type="button"
                        onClick={() => setTimezone(tz)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl border p-3 text-left text-sm transition-all",
                          timezone === tz
                            ? "border-foreground bg-foreground/5 ring-1 ring-foreground/10"
                            : "border-border hover:border-muted-foreground/40"
                        )}
                      >
                        <Globe className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <span className="font-medium text-foreground">{tz}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="done"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] as const }}
                >
                  <div className="text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 dark:bg-primary-950/30">
                      <CheckCircle2 className="h-7 w-7 text-primary-600" />
                    </div>
                    <h2 className="mt-4 text-lg font-semibold text-foreground">
                      You&apos;re all set!
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Here&apos;s a summary of your workspace settings:
                    </p>
                    <div className="mt-6 space-y-3 text-left">
                      <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                        <span className="text-sm text-muted-foreground">
                          Business
                        </span>
                        <span className="text-sm font-medium text-foreground">
                          {user?.businessName}
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                        <span className="text-sm text-muted-foreground">
                          Currency
                        </span>
                        <span className="text-sm font-medium text-foreground">
                          {CURRENCIES.find((c) => c.code === currency)?.label} (
                          {currency})
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                        <span className="text-sm text-muted-foreground">
                          Payment terms
                        </span>
                        <span className="text-sm font-medium text-foreground">
                          {PAYMENT_TERMS.find((t) => t.value === paymentTerms)
                            ?.label}
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                        <span className="text-sm text-muted-foreground">
                          Timezone
                        </span>
                        <span className="text-sm font-medium text-foreground">
                          {timezone}
                        </span>
                      </div>
                    </div>
                    {error && (
                      <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                        {error}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="mt-8 flex items-center justify-between">
              {step > 0 ? (
                <Button variant="ghost" onClick={goBack}>
                  <ArrowLeft className="mr-1.5 h-4 w-4" />
                  Back
                </Button>
              ) : (
                <div />
              )}
              {step < STEPS.length - 1 ? (
                <Button onClick={goNext}>
                  Continue
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleComplete}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowRight className="mr-1.5 h-4 w-4" />
                  )}
                  {loading ? "Saving…" : "Go to Dashboard"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
