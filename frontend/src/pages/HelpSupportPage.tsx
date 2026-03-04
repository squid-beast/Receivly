import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { ChevronDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSection {
  title: string;
  items: FAQItem[];
}

const FAQ_SECTIONS: FAQSection[] = [
  {
    title: "Getting Started",
    items: [
      {
        question: "What is Receivly?",
        answer:
          "Receivly is an invoicing and accounts-receivable tool for small and medium businesses. It lets you create invoices, track payments, and automatically remind clients about overdue bills — all from one dashboard.",
      },
      {
        question: "How do I set up my workspace?",
        answer:
          "After signing up you're taken to an onboarding screen where you enter your business name, default currency, payment terms, and timezone. These defaults are reused every time you create an invoice. You can change them later from the Settings page.",
      },
      {
        question: "Can multiple people use one workspace?",
        answer:
          "Right now each account has its own workspace. Multi-user / team access is on our roadmap and will be available in a future update.",
      },
    ],
  },
  {
    title: "Customers",
    items: [
      {
        question: "How do I add a customer?",
        answer:
          'Go to the Customers page and click "+ Add Customer". Enter the business name, billing email, and optionally a phone number, payment terms, and notes. Once saved, the customer appears in your list and can be selected when creating invoices.',
      },
      {
        question: "Can I edit or delete a customer?",
        answer:
          "Yes. Click a customer row to open their details, then use the Edit or Delete buttons. Deleting a customer does not remove invoices already sent to them.",
      },
    ],
  },
  {
    title: "Invoices",
    items: [
      {
        question: "How do I create an invoice?",
        answer:
          'Navigate to Invoices and click "Create Invoice". Select a customer, add one or more line items (description, quantity, unit price), set tax and discount if needed, then either save as a draft or send it directly.',
      },
      {
        question: "What does \"Save as Draft\" do?",
        answer:
          "A draft invoice is saved to your account but not sent to the client. You can review, edit, and send it whenever you're ready. Its status will show as Draft in the invoices list.",
      },
      {
        question: "How are invoice numbers generated?",
        answer:
          "Invoice numbers follow the format INV-YYYY-CLIENTCODE-00001 and auto-increment per workspace. You don't need to manage them manually.",
      },
      {
        question: "Can I edit an invoice after sending it?",
        answer:
          "You can edit an invoice as long as it hasn't been marked as paid. Once paid, the invoice is locked to preserve financial records.",
      },
      {
        question: "How is the due date calculated?",
        answer:
          "The due date is automatically set based on the customer's payment terms (e.g. Net 30 means 30 days from the issue date). You can also adjust it manually.",
      },
    ],
  },
  {
    title: "Payments",
    items: [
      {
        question: "How do I record a payment?",
        answer:
          'Open an invoice and click "Mark as Paid". This changes the status to Paid, records the payment date, and stops any automatic reminders for that invoice.',
      },
      {
        question: "Does Receivly process payments?",
        answer:
          "No. Receivly is a tracking tool. You receive payments through your own bank or payment provider, then mark the invoice as paid here so your dashboard stays accurate.",
      },
    ],
  },
  {
    title: "Reminders",
    items: [
      {
        question: "How do automatic reminders work?",
        answer:
          "When an invoice passes its due date and is still unpaid, Receivly can automatically send follow-up reminders at regular intervals (e.g. Day 7, 14, 21 after due). You can enable or disable this from Settings.",
      },
      {
        question: "Can I send a reminder manually?",
        answer:
          "Yes. Open an invoice and click \"Send Reminder\". A reminder is logged in the invoice's history regardless of whether automation is enabled.",
      },
      {
        question: "How do I stop reminders for a specific invoice?",
        answer:
          "Marking the invoice as paid automatically stops all reminders. If you need to stop reminders without marking it paid, you can disable reminder automation globally in Settings.",
      },
    ],
  },
  {
    title: "Settings & Account",
    items: [
      {
        question: "How do I change my currency or payment terms?",
        answer:
          "Go to Settings and update the Default Currency or Default Payment Terms fields. Changes apply to new invoices only — existing invoices keep their original values.",
      },
      {
        question: "What timezone setting is used for?",
        answer:
          "Your timezone determines how dates and times are displayed across the app (issue dates, due dates, reminder timestamps). Set it to match your business location for accuracy.",
      },
      {
        question: "Is my data secure?",
        answer:
          "Yes. Passwords are hashed with BCrypt, sessions are managed with JWT tokens, and all API routes are protected. Each workspace's data is fully isolated — no other account can see your invoices, customers, or settings.",
      },
    ],
  },
];

export function HelpSupportPage() {
  const [search, setSearch] = useState("");
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggle = (key: string) =>
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const query = search.toLowerCase().trim();

  const filteredSections = FAQ_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter(
      (item) =>
        !query ||
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query)
    ),
  })).filter((section) => section.items.length > 0);

  return (
    <AppLayout>
      <PageHeader
        title="Help & Support"
        description="Find answers to common questions about using Receivly."
      />

      {/* Search */}
      <div className="relative mt-8 max-w-xl">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search questions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* FAQ sections */}
      <div className="mt-8 space-y-8">
        {filteredSections.length === 0 && (
          <div className="rounded-xl border border-border bg-background px-6 py-16 text-center">
            <p className="text-sm text-muted-foreground">
              No results found for "{search}". Try a different keyword.
            </p>
          </div>
        )}

        {filteredSections.map((section) => (
          <div key={section.title}>
            <h2 className="mb-3 text-sm font-semibold text-foreground">
              {section.title}
            </h2>

            <div className="overflow-hidden rounded-xl border border-border bg-background">
              {section.items.map((item, idx) => {
                const key = `${section.title}-${idx}`;
                const isOpen = openItems.has(key);
                return (
                  <div
                    key={key}
                    className={cn(idx > 0 && "border-t border-border")}
                  >
                    <button
                      type="button"
                      onClick={() => toggle(key)}
                      className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-muted/40"
                    >
                      <span className="pr-4 text-sm font-medium text-foreground">
                        {item.question}
                      </span>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                          isOpen && "rotate-180"
                        )}
                      />
                    </button>
                    <div
                      className={cn(
                        "grid transition-all duration-200 ease-in-out",
                        isOpen
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      )}
                    >
                      <div className="overflow-hidden">
                        <p className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Contact support */}
      <div className="mt-10 rounded-xl border border-border bg-muted/30 px-6 py-8 text-center">
        <h3 className="text-base font-semibold text-foreground">
          Still have questions?
        </h3>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Reach out to us at{" "}
          <a
            href="mailto:startwithleo@gmail.com"
            className="font-medium text-emerald-600 underline underline-offset-2 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            startwithleo@gmail.com
          </a>{" "}
          and we'll get back to you within 24 hours.
        </p>
      </div>
    </AppLayout>
  );
}
