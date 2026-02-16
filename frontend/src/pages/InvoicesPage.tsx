import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  X,
  Loader2,
  FileText,
  CheckCircle2,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DetailDrawer } from "@/components/ui/DetailDrawer";
import { EmptyState } from "@/components/ui/EmptyState";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

interface Invoice {
  id: string;
  invoiceNumber: string;
  description: string;
  amount: number;
  currency: string;
  status: string;
  dueDate: string;
  paidAt: string | null;
  createdAt: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  paymentTerms: string;
}

export function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ customerId: "", description: "", amount: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [invRes, custRes] = await Promise.all([
        api.get("/invoices"),
        api.get("/customers"),
      ]);
      setInvoices(invRes.data);
      setCustomers(custRes.data);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openCreate = () => {
    setForm({ customerId: customers[0]?.id || "", description: "", amount: "" });
    setError(null);
    setModalOpen(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await api.post("/invoices", {
        customerId: form.customerId,
        description: form.description,
        amount: parseFloat(form.amount),
      });
      setModalOpen(false);
      await fetchData();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || "Something went wrong.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleMarkPaid = async (id: string) => {
    try {
      await api.patch(`/invoices/${id}/pay`);
      await fetchData();
      if (selectedInvoice?.id === id) {
        setSelectedInvoice((prev) => prev ? { ...prev, status: "PAID", paidAt: new Date().toISOString() } : null);
      }
    } catch {
      /* ignore */
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  };

  const filteredInvoices = invoices.filter((inv) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      inv.invoiceNumber.toLowerCase().includes(q) ||
      inv.customerName.toLowerCase().includes(q) ||
      inv.description.toLowerCase().includes(q)
    );
  });

  const selectClass = cn(
    "flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm shadow-black/5",
    "focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/20"
  );

  return (
    <AppLayout>
      <PageHeader title="Invoices" description="Create, track, and manage your invoices.">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search invoices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-48 pl-9 sm:w-64"
          />
        </div>
        <Button onClick={openCreate} disabled={customers.length === 0}>
          <Plus className="mr-1.5 h-4 w-4" />
          New Invoice
        </Button>
      </PageHeader>

      {loading ? (
        <div className="mt-12 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : invoices.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No invoices yet"
          description={
            customers.length === 0
              ? "Add a customer first, then create your first invoice."
              : "Create your first invoice to get started."
          }
          className="mt-8"
        >
          {customers.length > 0 && (
            <Button onClick={openCreate}>
              <Plus className="mr-1.5 h-4 w-4" />
              New Invoice
            </Button>
          )}
        </EmptyState>
      ) : (
        <div className="mt-6">
          <DataTable
            columns={[
              {
                key: "invoice",
                header: "Invoice",
                render: (inv: Invoice) => (
                  <div>
                    <p className="font-medium text-foreground">{inv.invoiceNumber}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{inv.description}</p>
                  </div>
                ),
              },
              {
                key: "customer",
                header: "Customer",
                className: "hidden sm:table-cell",
                headerClassName: "hidden sm:table-cell",
                render: (inv: Invoice) => (
                  <span className="text-muted-foreground">{inv.customerName}</span>
                ),
              },
              {
                key: "amount",
                header: "Amount",
                className: "text-right",
                headerClassName: "text-right",
                render: (inv: Invoice) => (
                  <span className="font-medium text-foreground">
                    {formatCurrency(inv.amount, inv.currency)}
                  </span>
                ),
              },
              {
                key: "dueDate",
                header: "Due Date",
                className: "hidden md:table-cell",
                headerClassName: "hidden md:table-cell",
                render: (inv: Invoice) => (
                  <span className="text-muted-foreground">
                    {new Date(inv.dueDate).toLocaleDateString()}
                  </span>
                ),
              },
              {
                key: "status",
                header: "Status",
                render: (inv: Invoice) => <StatusBadge status={inv.status} />,
              },
              {
                key: "action",
                header: "",
                className: "text-right",
                headerClassName: "text-right",
                render: (inv: Invoice) =>
                  inv.status !== "PAID" ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkPaid(inv.id);
                      }}
                      className="text-xs"
                    >
                      <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                      Mark Paid
                    </Button>
                  ) : null,
              },
            ]}
            data={filteredInvoices}
            keyExtractor={(inv) => inv.id}
            onRowClick={(inv) => setSelectedInvoice(inv)}
          />
        </div>
      )}

      {/* Invoice Detail Drawer */}
      <DetailDrawer
        open={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        title={selectedInvoice?.invoiceNumber || ""}
        subtitle={selectedInvoice?.customerName}
      >
        {selectedInvoice && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Amount</span>
                <span className="text-lg font-semibold text-foreground">
                  {formatCurrency(selectedInvoice.amount, selectedInvoice.currency)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <StatusBadge status={selectedInvoice.status} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Due Date</span>
                <span className="text-sm text-foreground">
                  {new Date(selectedInvoice.dueDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Customer Email</span>
                <span className="text-sm text-foreground">
                  {selectedInvoice.customerEmail}
                </span>
              </div>
              {selectedInvoice.paidAt && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Paid At</span>
                  <span className="text-sm text-foreground">
                    {new Date(selectedInvoice.paidAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            <div className="border-t border-border pt-4">
              <p className="text-sm font-medium text-foreground">Description</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {selectedInvoice.description}
              </p>
            </div>

            <div className="border-t border-border pt-4">
              <p className="mb-3 text-sm font-medium text-foreground">Timeline</p>
              <div className="space-y-3">
                <TimelineItem label="Invoice created" date={selectedInvoice.createdAt} />
                {selectedInvoice.status === "OVERDUE" && (
                  <TimelineItem label="Marked overdue" date={selectedInvoice.dueDate} variant="destructive" />
                )}
                {selectedInvoice.paidAt && (
                  <TimelineItem label="Payment received" date={selectedInvoice.paidAt} variant="success" />
                )}
              </div>
            </div>

            {selectedInvoice.status !== "PAID" && (
              <div className="border-t border-border pt-4">
                <Button className="w-full" onClick={() => handleMarkPaid(selectedInvoice.id)}>
                  <CheckCircle2 className="mr-1.5 h-4 w-4" />
                  Mark as Paid
                </Button>
              </div>
            )}
          </div>
        )}
      </DetailDrawer>

      {/* Create Invoice Modal */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              onClick={() => setModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: [0.21, 0.47, 0.32, 0.98] as const }}
              className="fixed inset-x-4 top-[10%] z-50 mx-auto max-w-md rounded-lg border border-border bg-background p-6 shadow-xl sm:inset-x-auto"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">New Invoice</h2>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setModalOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {error && (
                <div className="mt-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <form onSubmit={handleCreate} className="mt-5 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="inv-customer">Customer</Label>
                  <select
                    id="inv-customer"
                    value={form.customerId}
                    onChange={(e) => setForm((f) => ({ ...f, customerId: e.target.value }))}
                    required
                    className={selectClass}
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inv-desc">Description</Label>
                  <Input
                    id="inv-desc"
                    placeholder="Website development - Phase 1"
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inv-amount">Amount</Label>
                  <Input
                    id="inv-amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="1500.00"
                    value={form.amount}
                    onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
                    Create Invoice
                  </Button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}

function TimelineItem({ label, date, variant }: { label: string; date: string; variant?: "success" | "destructive" }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "h-2 w-2 rounded-full",
          variant === "success"
            ? "bg-green-500"
            : variant === "destructive"
              ? "bg-red-500"
              : "bg-muted-foreground/40"
        )}
      />
      <div className="flex flex-1 items-center justify-between">
        <span className="text-sm text-foreground">{label}</span>
        <span className="text-xs text-muted-foreground">
          {new Date(date).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
