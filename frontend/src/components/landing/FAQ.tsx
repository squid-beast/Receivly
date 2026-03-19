import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SECTION_PADDING, SECTION_HEADING_MB, SECTION_SCROLL_MARGIN } from "@/components/landing/landing-section";
import { cn } from "@/lib/utils";

const faqCategories = [
  {
    title: "Account & setup",
    items: [
      {
        question: "Do I need to connect my bank account?",
        answer:
          "No. You can manually mark invoices as paid. Bank sync is optional.",
      },
      {
        question: "Can I set payment terms for each customer?",
        answer:
          "Yes. Each customer can have default payment terms like Net 7, Net 14, or Net 30.",
      },
    ],
  },
  {
    title: "Invoicing & reminders",
    items: [
      {
        question: "How are reminders sent?",
        answer:
          "Receivly automatically sends reminder emails based on invoice due dates unless you pause them.",
      },
      {
        question: "Can I see which invoices are overdue?",
        answer:
          "Yes. The dashboard clearly separates sent, overdue, and paid invoices.",
      },
    ],
  },
  {
    title: "Security & data",
    items: [
      {
        question: "Is my business data shared with other users?",
        answer:
          "No. Each workspace is isolated so your customers and invoices remain private.",
      },
      {
        question: "Can I export my invoice records?",
        answer:
          "Yes, export options are planned for reporting and bookkeeping needs.",
      },
    ],
  },
];

export function FAQ() {
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <section id="faq" className={cn(SECTION_PADDING, SECTION_SCROLL_MARGIN)}>
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
          {/* Left: heading + get in touch */}
          <div className={cn("lg:pt-2", SECTION_HEADING_MB)}>
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
              Got Questions?
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              If you can't find what you're looking for,{" "}
              <a
                href="mailto:founder@getreceivly.com"
                className="font-medium text-primary-600 underline underline-offset-4 hover:text-primary-700"
              >
                founder@getreceivly.com
              </a>
              .
            </p>
          </div>

          {/* Right: categorized accordion (single list with section headers) */}
          <div className="border-b border-border">
            {faqCategories.map((category) => (
              <div key={category.title} className="mb-10 last:mb-0">
                <h3 className="pt-6 first:pt-0 text-sm font-semibold text-foreground">
                  {category.title}
                </h3>
                <div className="mt-2">
                  {category.items.map((faq) => {
                    const key = `${category.title}-${faq.question}`;
                    const isOpen = openKey === key;
                    return (
                      <div
                        key={key}
                        className={cn(
                          "border-t border-border transition-colors",
                          isOpen && "bg-muted/30"
                        )}
                      >
                        <button
                          type="button"
                          className="flex min-h-[48px] w-full items-center justify-between gap-4 py-4 pr-2 text-left sm:min-h-0"
                          onClick={() =>
                            setOpenKey(isOpen ? null : key)
                          }
                          aria-expanded={isOpen}
                        >
                          <span
                            className={cn(
                              "text-sm font-medium transition-colors",
                              isOpen
                                ? "text-primary-600"
                                : "text-foreground"
                            )}
                          >
                            {faq.question}
                          </span>
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                              isOpen && "rotate-180 text-primary-600"
                            )}
                          />
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{
                                duration: 0.2,
                                ease: "easeInOut",
                              }}
                              className="overflow-hidden"
                            >
                              <p className="pb-4 text-sm leading-relaxed text-muted-foreground">
                                {faq.answer}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
