import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Loader2,
  FileText,
  CheckCircle2,
  Search,
  MoreVertical,
  Eye,
  Clock,
  DollarSign,
  AlertTriangle,
  ArrowUpDown,
  Filter,
  Send,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DetailDrawer } from "@/components/ui/DetailDrawer";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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

interface DashboardStats {
  totalSent: number;
  totalOverdue: number;
  totalPaid: number;
  countSent: number;
  countOverdue: number;
  countPaid: number;
  currency: string;
}

type StatusFilter = "ALL" | "SENT" | "OVERDUE" | "PAID";
type SortOrder = "newest" | "oldest";

const STATUS_TABS: { key: StatusFilter; label: string }[] = [
  { key: "ALL", label: "All Invoices" },
  { key: "SENT", label: "Unpaid" },
  { key: "OVERDUE", label: "Overdue" },
  { key: "PAID", label: "Paid" },
];

export function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ customerId: "", description: "", amount: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [customerFilter, setCustomerFilter] = useState<string>("ALL");

  const fetchData = useCallback(async () => {
    try {
      const [invRes, custRes, statsRes] = await Promise.all([
        api.get("/invoices"),
        api.get("/customers"),
        api.get("/dashboard/stats"),
      ]);
      setInvoices(invRes.data);
      setCustomers(custRes.data);
      setStats(statsRes.data);
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
        setSelectedInvoice((prev) =>
          prev ? { ...prev, status: "PAID", paidAt: new Date().toISOString() } : null
        );
      }
    } catch {
      /* ignore */
    }
  };

  const formatCurrency = (amount: number, currency: string) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const statusCounts = invoices.reduce(
    (acc, inv) => {
      acc[inv.status] = (acc[inv.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const filteredInvoices = invoices
    .filter((inv) => {
      if (statusFilter !== "ALL" && inv.status !== statusFilter) return false;
      if (customerFilter !== "ALL" && inv.customerId !== customerFilter) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        inv.invoiceNumber.toLowerCase().includes(q) ||
        inv.customerName.toLowerCase().includes(q) ||
        inv.description.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

  const selectClass = cn(
    "flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm shadow-black/5",
    "focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/20"
  );

  const hasActiveFilters = customerFilter !== "ALL";

  return (
    <AppLayout>
      <PageHeader title="Invoices" description="Create, track, and manage your invoices.">
        <Button onClick={openCreate} disabled={customers.length === 0}>
          <Plus className="mr-1.5 h-4 w-4" />
          Create an invoice
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
        <div className="mt-6 space-y-6">
          {/* ── Metrics Row (ProAcc-style) ── */}
          {stats && (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <MetricTile
                icon={<AlertTriangle className="h-5 w-5" />}
                iconBg="bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                value={formatCurrency(stats.totalOverdue, stats.currency)}
                label="Overdue amount"
              />
              <MetricTile
                icon={<Send className="h-5 w-5" />}
                iconBg="bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                value={formatCurrency(stats.totalSent, stats.currency)}
                label="Sent totals"
              />
              <MetricTile
                icon={<DollarSign className="h-5 w-5" />}
                iconBg="bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
                value={formatCurrency(
                  stats.totalSent + stats.totalOverdue,
                  stats.currency
                )}
                label="Unpaid totals"
              />
              <MetricTile
                icon={<Clock className="h-5 w-5" />}
                iconBg="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                value={formatCurrency(stats.totalPaid, stats.currency)}
                label="Total collected"
              />
            </div>
          )}

          {/* ── Search + Filter Tabs + Controls ── */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {/* Search (left) */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Enter invoice number..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 sm:w-72"
                />
              </div>

              {/* Tabs + Controls (right) */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 overflow-x-auto">
                  {STATUS_TABS.map((tab) => {
                    const count =
                      tab.key === "ALL"
                        ? invoices.length
                        : statusCounts[tab.key] || 0;
                    const isActive = statusFilter === tab.key;
                    return (
                      <button
                        key={tab.key}
                        onClick={() => setStatusFilter(tab.key)}
                        className={cn(
                          "inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all",
                          isActive
                            ? "bg-foreground text-background shadow-sm"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        {tab.label}
                        <span
                          className={cn(
                            "inline-flex min-w-[20px] items-center justify-center rounded-md px-1.5 py-0.5 text-[10px] font-bold",
                            isActive
                              ? "bg-background/20 text-background"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Filter Popover */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "gap-1.5",
                        hasActiveFilters && "border-primary text-primary"
                      )}
                    >
                      <Filter className="h-3.5 w-3.5" />
                      Filter
                      {hasActiveFilters && (
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                          1
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-64 space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-muted-foreground">
                        Customer
                      </Label>
                      <select
                        value={customerFilter}
                        onChange={(e) => setCustomerFilter(e.target.value)}
                        className={selectClass}
                      >
                        <option value="ALL">All Customers</option>
                        {customers.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {hasActiveFilters && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-muted-foreground"
                        onClick={() => setCustomerFilter("ALL")}
                      >
                        <X className="mr-1.5 h-3.5 w-3.5" />
                        Clear filters
                      </Button>
                    )}
                  </PopoverContent>
                </Popover>

                {/* Sort */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <ArrowUpDown className="h-3.5 w-3.5" />
                      {sortOrder === "newest" ? "Newest First" : "Oldest First"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSortOrder("newest")}>
                      Newest First
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOrder("oldest")}>
                      Oldest First
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* ── Invoice Table ── */}
          <div className="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Invoice number
                    </th>
                    <th className="hidden px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:table-cell">
                      Customer
                    </th>
                    <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Date
                    </th>
                    <th className="pl-4 pr-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Total
                    </th>
                    <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Status
                    </th>
                    <th className="w-12 px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((inv, idx) => (
                    <tr
                      key={inv.id}
                      onClick={() => setSelectedInvoice(inv)}
                      className={cn(
                        "cursor-pointer transition-colors hover:bg-muted/30",
                        idx !== filteredInvoices.length - 1 &&
                          "border-b border-border/60"
                      )}
                    >
                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-foreground">
                          {inv.invoiceNumber}
                        </span>
                      </td>
                      <td className="hidden px-4 py-3.5 sm:table-cell">
                        <span className="text-foreground">{inv.customerName}</span>
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground">
                        {formatDate(inv.createdAt)}
                      </td>
                      <td className="pl-4 pr-6 py-3.5 text-right font-semibold text-foreground">
                        {formatCurrency(inv.amount, inv.currency)}
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={inv.status} />
                      </td>
                      <td className="px-2 py-3.5">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedInvoice(inv);
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            {inv.status !== "PAID" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMarkPaid(inv.id);
                                  }}
                                  className="text-emerald-600 focus:text-emerald-600"
                                >
                                  <CheckCircle2 className="mr-2 h-4 w-4" />
                                  Mark as Paid
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                  {filteredInvoices.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-12 text-center text-sm text-muted-foreground"
                      >
                        No invoices match your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Results count */}
          <p className="text-xs text-muted-foreground">
            Showing {filteredInvoices.length} of {invoices.length} invoices
          </p>
        </div>
      )}

      {/* ── Invoice Detail Drawer ── */}
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
                  {new Date(selectedInvoice.dueDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Customer</span>
                <span className="text-sm text-foreground">
                  {selectedInvoice.customerEmail}
                </span>
              </div>
              {selectedInvoice.paidAt && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Paid At</span>
                  <span className="text-sm text-foreground">
                    {new Date(selectedInvoice.paidAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
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
                  <TimelineItem
                    label="Marked overdue"
                    date={selectedInvoice.dueDate}
                    variant="destructive"
                  />
                )}
                {selectedInvoice.paidAt && (
                  <TimelineItem
                    label="Payment received"
                    date={selectedInvoice.paidAt}
                    variant="success"
                  />
                )}
              </div>
            </div>

            {selectedInvoice.status !== "PAID" && (
              <div className="border-t border-border pt-4">
                <Button
                  className="w-full"
                  onClick={() => handleMarkPaid(selectedInvoice.id)}
                >
                  <CheckCircle2 className="mr-1.5 h-4 w-4" />
                  Mark as Paid
                </Button>
              </div>
            )}
          </div>
        )}
      </DetailDrawer>

      {/* ── Create Invoice Dialog ── */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Invoice</DialogTitle>
            <DialogDescription>
              Create a new invoice for one of your customers.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="inv-customer">Customer</Label>
              <select
                id="inv-customer"
                value={form.customerId}
                onChange={(e) =>
                  setForm((f) => ({ ...f, customerId: e.target.value }))
                }
                required
                className={selectClass}
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="inv-desc">Description</Label>
              <Input
                id="inv-desc"
                placeholder="Website development - Phase 1"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
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
                onChange={(e) =>
                  setForm((f) => ({ ...f, amount: e.target.value }))
                }
                required
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
                Create Invoice
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}

/* ── Sub-components ── */

function MetricTile({
  icon,
  iconBg,
  value,
  label,
}: {
  icon: React.ReactNode;
  iconBg: string;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-background p-4 shadow-sm transition-shadow hover:shadow-md">
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
          iconBg
        )}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="truncate font-display text-lg font-bold tracking-tight text-foreground">
          {value}
        </p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function TimelineItem({
  label,
  date,
  variant,
}: {
  label: string;
  date: string;
  variant?: "success" | "destructive";
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "h-2 w-2 rounded-full",
          variant === "success"
            ? "bg-emerald-500"
            : variant === "destructive"
              ? "bg-red-500"
              : "bg-muted-foreground/40"
        )}
      />
      <div className="flex flex-1 items-center justify-between">
        <span className="text-sm text-foreground">{label}</span>
        <span className="text-xs text-muted-foreground">
          {new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>
    </div>
  );
}
