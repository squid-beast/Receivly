import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Loader2,
  FileText,
  CheckCircle2,
  Search,
  MoreVertical,
  Eye,
  Send,
  Pencil,
  Trash2,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppLayout } from "@/components/AppLayout";
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
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { cn, formatDateInTimezone } from "@/lib/utils";
import { CustomerAvatar } from "@/components/ui/customer-avatar";
import { generateInvoicePdf } from "@/lib/generateInvoicePdf";

interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  description: string;
  amount: number;
  subtotal: number;
  taxRate: number;
  discountAmount: number;
  currency: string;
  status: string;
  issueDate?: string;
  dueDate: string;
  paidAt: string | null;
  sentAt?: string | null;
  createdAt: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerAddress?: string | null;
  workspaceAddress?: string | null;
  workspaceBusinessName?: string | null;
  lineItems: InvoiceLineItem[];
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

interface ReminderItem {
  id: string;
  daysPastDue: number;
  recipientEmail: string;
  sentAt: string;
}

type StatusFilter = "ALL" | "DRAFT" | "SENT" | "OVERDUE" | "PAID";
type SortOrder = "newest" | "oldest";

const STATUS_TABS: { key: StatusFilter; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "DRAFT", label: "Draft" },
  { key: "SENT", label: "Pending" },
  { key: "PAID", label: "Paid" },
  { key: "OVERDUE", label: "Overdue" },
];

const PAGE_SIZE = 10;

export function InvoicesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const tz = user?.timezone ?? "UTC";
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ customerId: "", description: "", amount: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [sortOrder] = useState<SortOrder>("newest");
  const [customerFilter] = useState<string>("ALL");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ description: "", amount: "", dueDate: "" });
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const [remindersLoading, setRemindersLoading] = useState(false);
  const [sendingReminder, setSendingReminder] = useState(false);
  const [sendingToClient, setSendingToClient] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [drawerError, setDrawerError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);

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

  useEffect(() => {
    if (!selectedInvoice?.id) {
      setReminders([]);
      setDrawerError(null);
      setDeleteConfirmId(null);
      return;
    }
    setDrawerError(null);
    setDeleteConfirmId(null);
    setRemindersLoading(true);
    api
      .get(`/invoices/${selectedInvoice.id}/reminders`)
      .then((res) => setReminders(res.data ?? []))
      .catch(() => setReminders([]))
      .finally(() => setRemindersLoading(false));
  }, [selectedInvoice?.id]);

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

  const [markingPaid, setMarkingPaid] = useState(false);

  const handleMarkPaid = async (id: string) => {
    setMarkingPaid(true);
    setDrawerError(null);
    try {
      await api.patch(`/invoices/${id}/pay`);
      await fetchData();
      if (selectedInvoice?.id === id) {
        setSelectedInvoice((prev) =>
          prev ? { ...prev, status: "PAID", paidAt: new Date().toISOString() } : null
        );
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        "Could not mark as paid.";
      setDrawerError(msg);
    } finally {
      setMarkingPaid(false);
    }
  };

  const openEdit = (inv: Invoice) => {
    setError(null);
    setEditForm({
      description: inv.description,
      amount: String(inv.amount),
      dueDate: inv.dueDate?.toString().slice(0, 10) ?? "",
    });
    setEditModalOpen(true);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;
    setError(null);
    setSaving(true);
    try {
      const res = await api.put(`/invoices/${selectedInvoice.id}`, {
        description: editForm.description,
        amount: parseFloat(editForm.amount),
        dueDate: editForm.dueDate,
      });
      setEditModalOpen(false);
      setSelectedInvoice(res.data);
      await fetchData();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        "Something went wrong.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    setDrawerError(null);
    try {
      await api.delete(`/invoices/${id}`);
      setDeleteConfirmId(null);
      setSelectedInvoice(null);
      await fetchData();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        "Could not delete invoice.";
      setDrawerError(msg);
    } finally {
      setDeleting(false);
    }
  };

  const handleSendToClient = async (id: string) => {
    setSendingToClient(true);
    setDrawerError(null);
    try {
      // Fetch full invoice data (includes lineItems, subtotal, etc.)
      const fullRes = await api.get(`/invoices/${id}`);
      const inv: Invoice = fullRes.data;

      const pdfBase64 = await generateInvoicePdf({
        invoiceNumber: inv.invoiceNumber,
        issueDate: inv.issueDate ?? null,
        dueDate: inv.dueDate,
        currency: inv.currency,
        subtotal: inv.subtotal,
        taxRate: inv.taxRate,
        discountAmount: inv.discountAmount,
        amount: inv.amount,
        customerName: inv.customerName,
        customerEmail: inv.customerEmail,
        customerAddress: inv.customerAddress ?? null,
        workspaceBusinessName: inv.workspaceBusinessName ?? null,
        workspaceAddress: inv.workspaceAddress ?? null,
        lineItems: inv.lineItems,
      });

      const fileName = `Invoice_${inv.invoiceNumber}.pdf`;
      const res = await api.post(`/invoices/${id}/send`, { pdfBase64, fileName });
      if (selectedInvoice?.id === id) setSelectedInvoice(res.data);
      await fetchData();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        "Could not send invoice.";
      setDrawerError(msg);
    } finally {
      setSendingToClient(false);
    }
  };

  const handleSendReminderNow = async (id: string) => {
    if (!selectedInvoice || selectedInvoice.id !== id) return;
    setSendingReminder(true);
    setDrawerError(null);
    try {
      await api.post(`/invoices/${id}/reminders/send`);
      const res = await api.get(`/invoices/${id}/reminders`);
      setReminders(res.data ?? []);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        "Could not send reminder.";
      setDrawerError(msg);
    } finally {
      setSendingReminder(false);
    }
  };

  const formatCurrency = (amount: number, currency: string) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);

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

  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / PAGE_SIZE));
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const getLastActivity = (inv: Invoice) => {
    const d = inv.paidAt || inv.sentAt || inv.createdAt;
    return d ? formatDateInTimezone(d, tz) : "—";
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedInvoices.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedInvoices.map((i) => i.id)));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectClass = cn(
    "flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm shadow-black/5",
    "focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/20"
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, customerFilter, search]);

  return (
    <AppLayout>
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Header: Title | Search | Create */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="font-display text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Invoices
            </h1>
            <div className="flex flex-1 items-center gap-4 sm:max-w-md sm:flex-initial sm:justify-end">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search invoice..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-9 w-full border-gray-200 bg-white pl-9 dark:border-gray-700 dark:bg-gray-900 sm:w-64"
                />
              </div>
              <Button
                onClick={() => navigate("/dashboard/invoices/new")}
                disabled={customers.length === 0}
                className="bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700"
              >
                <Plus className="mr-1.5 h-4 w-4" />
                Create invoice
              </Button>
            </div>
          </div>

          {/* Tabs: All, Draft, Pending, Paid, Overdue (underline active) */}
          <div className="border-b border-gray-200 dark:border-gray-800">
            <div className="flex gap-8">
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
                      "border-b-2 pb-3 text-sm font-medium transition-colors",
                      isActive
                        ? "border-emerald-600 text-emerald-600 dark:border-emerald-500 dark:text-emerald-500"
                        : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    )}
                  >
                    {tab.label}
                    <span className="ml-1.5 text-gray-400 dark:text-gray-500">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {invoices.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No invoices yet"
              description={
                customers.length === 0
                  ? "Add a customer first, then create your first invoice."
                  : "Create your first invoice to get started."
              }
              className="mt-10"
            >
              {customers.length > 0 && (
                <Button
                  onClick={() => navigate("/dashboard/invoices/new")}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Plus className="mr-1.5 h-4 w-4" />
                  New Invoice
                </Button>
              )}
            </EmptyState>
          ) : (
            <>
              {/* Table - Monefy style: checkbox, Invoice #, Client, Due Date, Amount, Status, Last Activity, kebab */}
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
                        <th className="w-12 px-6 py-4">
                          <input
                            type="checkbox"
                            checked={
                              paginatedInvoices.length > 0 &&
                              selectedIds.size === paginatedInvoices.length
                            }
                            onChange={toggleSelectAll}
                            className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                          />
                        </th>
                        <th className="px-6 py-4 text-left font-medium text-gray-600 dark:text-gray-400">
                          Invoice #
                        </th>
                        <th className="px-6 py-4 text-left font-medium text-gray-600 dark:text-gray-400">
                          Client
                        </th>
                        <th className="px-6 py-4 text-left font-medium text-gray-600 dark:text-gray-400">
                          Due Date
                        </th>
                        <th className="px-6 py-4 text-right font-medium text-gray-600 dark:text-gray-400">
                          Amount
                        </th>
                        <th className="px-6 py-4 text-left font-medium text-gray-600 dark:text-gray-400">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left font-medium text-gray-600 dark:text-gray-400">
                          Last Activity
                        </th>
                        <th className="w-12 px-4 py-4" />
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedInvoices.map((inv, idx) => (
                        <tr
                          key={inv.id}
                          onClick={() => setSelectedInvoice(inv)}
                          className={cn(
                            "cursor-pointer border-b border-gray-100 transition-colors last:border-0 hover:bg-gray-50 dark:border-gray-800/50 dark:hover:bg-gray-900/50",
                            idx % 2 === 0
                              ? "bg-white dark:bg-gray-950"
                              : "bg-gray-50/50 dark:bg-gray-900/30"
                          )}
                        >
                          <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={selectedIds.has(inv.id)}
                              onChange={() => toggleSelect(inv.id)}
                              className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                            />
                          </td>
                          <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                            {inv.invoiceNumber}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2.5">
                              <CustomerAvatar name={inv.customerName} size={28} />
                              <span className="text-gray-700 dark:text-gray-300">
                                {inv.customerName}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                            {formatDateInTimezone(inv.dueDate, tz)}
                          </td>
                          <td className="px-6 py-4 text-right font-medium text-gray-900 dark:text-gray-100">
                            {formatCurrency(inv.amount, inv.currency)}
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={inv.status} />
                          </td>
                          <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                            {getLastActivity(inv)}
                          </td>
                          <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
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
                                        setSelectedInvoice(inv);
                                        openEdit(inv);
                                      }}
                                    >
                                      <Pencil className="mr-2 h-4 w-4" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleSendToClient(inv.id);
                                      }}
                                    >
                                      <Send className="mr-2 h-4 w-4" />
                                      Send to client
                                    </DropdownMenuItem>
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
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedInvoice(inv);
                                        setDeleteConfirmId(inv.id);
                                      }}
                                      className="text-destructive focus:text-destructive"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                      {paginatedInvoices.length === 0 && (
                        <tr>
                          <td
                            colSpan={8}
                            className="px-6 py-16 text-center text-sm text-gray-500 dark:text-gray-400"
                          >
                            No invoices match your filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination - Monefy style */}
              {filteredInvoices.length > 0 && totalPages > 0 && (
                <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-950">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="border-gray-200 dark:border-gray-700"
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={cn(
                            "flex h-8 min-w-[2rem] items-center justify-center rounded text-sm font-medium transition-colors",
                            currentPage === pageNum
                              ? "bg-emerald-600 text-white"
                              : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                          )}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    {totalPages > 5 && (
                      <span className="px-2 text-gray-400">…</span>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage >= totalPages}
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    className="border-gray-200 dark:border-gray-700"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
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
          <div className="space-y-8">
            <div className="space-y-5">
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
              {selectedInvoice.issueDate && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Issue date</span>
                  <span className="text-sm text-foreground">
                    {formatDateInTimezone(selectedInvoice.issueDate, tz)}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Due date</span>
                <span className="text-sm text-foreground">
                  {formatDateInTimezone(selectedInvoice.dueDate, tz)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Customer</span>
                <span className="text-sm text-foreground">
                  {selectedInvoice.customerEmail}
                </span>
              </div>
              {selectedInvoice.sentAt && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Sent at</span>
                  <span className="text-sm text-foreground">
                    {formatDateInTimezone(selectedInvoice.sentAt, tz)}
                  </span>
                </div>
              )}
              {selectedInvoice.paidAt && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Paid At</span>
                  <span className="text-sm text-foreground">
                    {formatDateInTimezone(selectedInvoice.paidAt, tz)}
                  </span>
                </div>
              )}
            </div>

            <div className="border-t border-border pt-5">
              <p className="text-sm font-medium text-foreground">Description</p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {selectedInvoice.description}
              </p>
            </div>

            <div className="border-t border-border pt-5">
              <p className="mb-4 text-sm font-medium text-foreground">Timeline</p>
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

            <div className="border-t border-border pt-5">
              <p className="mb-4 text-sm font-medium text-foreground">Reminder history</p>
              {remindersLoading ? (
                <p className="text-sm text-muted-foreground">Loading…</p>
              ) : reminders.length === 0 ? (
                <p className="text-sm text-muted-foreground">No reminders sent yet.</p>
              ) : (
                <ul className="space-y-2">
                  {reminders.map((r) => (
                    <li
                      key={r.id}
                      className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-sm"
                    >
                      <span className="text-muted-foreground">
                        Day {r.daysPastDue} past due → {r.recipientEmail}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDateInTimezone(r.sentAt, tz)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              {(selectedInvoice.status === "SENT" || selectedInvoice.status === "OVERDUE") && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 w-full gap-2"
                  onClick={() => handleSendReminderNow(selectedInvoice.id)}
                  disabled={sendingReminder}
                >
                  {sendingReminder ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Bell className="h-4 w-4" />
                  )}
                  Send reminder now
                </Button>
              )}
            </div>

            {drawerError && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {drawerError}
              </div>
            )}

            <div className="border-t border-border pt-5 space-y-3">
              {selectedInvoice.status !== "PAID" && (
                <>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => openEdit(selectedInvoice)}
                    >
                      <Pencil className="mr-1.5 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 text-destructive hover:text-destructive"
                      onClick={() => setDeleteConfirmId(selectedInvoice.id)}
                    >
                      <Trash2 className="mr-1.5 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleSendToClient(selectedInvoice.id)}
                    disabled={sendingToClient}
                  >
                    {sendingToClient ? (
                      <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="mr-1.5 h-4 w-4" />
                    )}
                    {sendingToClient ? "Sending…" : "Send to client"}
                  </Button>
                </>
              )}
              {selectedInvoice.status !== "PAID" && (
                <Button
                  className="w-full"
                  onClick={() => handleMarkPaid(selectedInvoice.id)}
                  disabled={markingPaid}
                >
                  {markingPaid ? (
                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="mr-1.5 h-4 w-4" />
                  )}
                  {markingPaid ? "Processing…" : "Mark as Paid"}
                </Button>
              )}
            </div>
            {deleteConfirmId === selectedInvoice.id && (
              <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                <p className="text-sm text-foreground">Delete this invoice? This cannot be undone.</p>
                <div className="mt-3 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteConfirmId(null)}
                    disabled={deleting}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-destructive text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(selectedInvoice.id)}
                    disabled={deleting}
                  >
                    {deleting ? (
                      <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="mr-1.5 h-4 w-4" />
                    )}
                    {deleting ? "Deleting…" : "Delete"}
                  </Button>
                </div>
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

      {/* Edit Invoice Dialog */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Invoice</DialogTitle>
            <DialogDescription>
              Update description, amount, or due date. Paid invoices cannot be edited.
            </DialogDescription>
          </DialogHeader>
          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <form onSubmit={handleEdit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-desc">Description</Label>
              <Input
                id="edit-desc"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, description: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-amount">Amount</Label>
              <Input
                id="edit-amount"
                type="number"
                step="0.01"
                min="0.01"
                value={editForm.amount}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, amount: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-due">Due date</Label>
              <Input
                id="edit-due"
                type="date"
                value={editForm.dueDate}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, dueDate: e.target.value }))
                }
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}

/* ── Sub-components ── */

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
