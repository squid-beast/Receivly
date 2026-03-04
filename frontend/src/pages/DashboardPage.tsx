import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { MetricsCard } from "@/components/ui/MetricsCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CustomerAvatar } from "@/components/ui/customer-avatar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  DollarSign,
  Users,
  TrendingUp,
  Loader2,
  Send,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import api from "@/lib/api";

interface DashboardStats {
  totalSent: number;
  totalOverdue: number;
  totalPaid: number;
  totalOutstanding: number;
  paidThisWeek: number;
  countSent: number;
  countOverdue: number;
  countPaid: number;
  currency: string;
}

interface DashboardInvoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: string;
  issueDate?: string;
  dueDate: string;
  paidAt: string | null;
  createdAt: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
}

interface DashboardCustomer {
  id: string;
  name: string;
  email: string;
}

const RECENT_PAGE_SIZE = 5;

type ChartRange = "3d" | "7d" | "14d" | "30d";

const CHART_RANGE_OPTIONS: { key: ChartRange; label: string }[] = [
  { key: "3d", label: "3d" },
  { key: "7d", label: "7d" },
  { key: "14d", label: "14d" },
  { key: "30d", label: "30d" },
];

export function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [invoices, setInvoices] = useState<DashboardInvoice[]>([]);
  const [customers, setCustomers] = useState<DashboardCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [recentPage, setRecentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [chartRange, setChartRange] = useState<ChartRange>("30d");

  useEffect(() => {
    Promise.all([
      api.get("/dashboard/stats").then((r) => setStats(r.data)),
      api.get("/invoices").then((r) => setInvoices(r.data || [])),
      api.get("/customers").then((r) => setCustomers(r.data || [])),
    ]).finally(() => setLoading(false));
  }, []);

  const formatCurrency = (amount: number, currency: string) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
      amount
    );

  // Transaction volume by day: Received (paid) vs Invoiced (sent)
  const chartData = useMemo(() => {
    if (!invoices.length) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let rangeStart: Date;
    let rangeEnd: Date;

    if (chartRange === "30d") {
      // Full current month: e.g. Mar 1–31
      const year = today.getFullYear();
      const month = today.getMonth();
      rangeStart = new Date(year, month, 1);
      rangeEnd = new Date(year, month + 1, 0);
    } else {
      // Rolling last N days including today
      const daysBack =
        chartRange === "3d" ? 3 : chartRange === "7d" ? 7 : 14;
      rangeEnd = new Date(today);
      rangeStart = new Date(today);
      rangeStart.setDate(today.getDate() - (daysBack - 1));
    }

    rangeStart.setHours(0, 0, 0, 0);
    rangeEnd.setHours(0, 0, 0, 0);

    const days: {
      date: string;
      dateKey: string;
      received: number;
      invoiced: number;
    }[] = [];

    for (let d = new Date(rangeStart); d <= rangeEnd; d.setDate(d.getDate() + 1)) {
      const key = d.toISOString().slice(0, 10); // YYYY-MM-DD
      days.push({
        date: d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        dateKey: key,
        received: 0,
        invoiced: 0,
      });
    }

    invoices.forEach((inv) => {
      const issueDate = inv.issueDate
        ? new Date(inv.issueDate)
        : new Date(inv.createdAt);
      issueDate.setHours(0, 0, 0, 0);
      if (issueDate >= rangeStart && issueDate <= rangeEnd) {
        const issueKey = issueDate.toISOString().slice(0, 10);
        const issueDay = days.find((d) => d.dateKey === issueKey);
        if (issueDay) {
          issueDay.invoiced += inv.amount;
        }
      }

      const issueKey = issueDate.toISOString().slice(0, 10);
      if (inv.status === "PAID" && inv.paidAt) {
        const paidDate = new Date(inv.paidAt);
        paidDate.setHours(0, 0, 0, 0);
        if (paidDate >= rangeStart && paidDate <= rangeEnd) {
          const paidKey = paidDate.toISOString().slice(0, 10);
          const paidDay = days.find((d) => d.dateKey === paidKey);
          if (paidDay) {
            paidDay.received += inv.amount;
          }
        }
      }
    });

    return days;
  }, [invoices, chartRange]);

  // Recent transactions (invoices) with pagination
  const filteredRecent = useMemo(() => {
    let list = [...invoices].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (i) =>
          i.customerName?.toLowerCase().includes(q) ||
          i.invoiceNumber?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [invoices, searchQuery]);

  const totalRecentPages = Math.ceil(
    filteredRecent.length / RECENT_PAGE_SIZE
  );
  const recentPaginated = useMemo(
    () =>
      filteredRecent.slice(
        recentPage * RECENT_PAGE_SIZE,
        (recentPage + 1) * RECENT_PAGE_SIZE
      ),
    [filteredRecent, recentPage]
  );

  // Quick transfer: first 5 customers for avatars
  const quickTransferCustomers = customers.slice(0, 5);

  const currency = stats?.currency ?? "USD";

  return (
    <AppLayout>
      <div className="space-y-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <PageHeader
            title={`Welcome back, ${user?.fullName?.split(" ")[0] ?? "there"}`}
            description={user?.businessName}
          />
          <div className="w-full sm:max-w-xs">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search queries..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setRecentPage(0);
                }}
                className="pl-9"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-10">
            {/* Top KPI cards - Finansi style */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <MetricsCard
                label="Total Revenue"
                value={stats ? formatCurrency(stats.totalPaid, currency) : "$0"}
                subtitle="Total collected from paid invoices"
                icon={DollarSign}
                iconClassName="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
                valueClassName="text-foreground"
              />
              <MetricsCard
                label="Active Customer Accounts"
                value={String(customers.length)}
                subtitle="Customers in your workspace"
                icon={Users}
                iconClassName="bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400"
                valueClassName="text-foreground"
              />
              <MetricsCard
                label="Weekly Revenue"
                value={
                  stats
                    ? formatCurrency(stats.paidThisWeek ?? 0, currency)
                    : "$0"
                }
                subtitle="Last 7 days"
                icon={TrendingUp}
                iconClassName="bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400"
                valueClassName="text-foreground"
              />
            </div>

            {/* Transaction Volume + Quick Invoice */}
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="rounded-3xl border border-border/70 bg-gradient-to-b from-background to-muted/10 p-6 shadow-sm lg:col-span-2">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <h3 className="font-semibold text-foreground">
                    Transaction Volume
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="hidden text-xs text-muted-foreground sm:inline">
                      {chartRange === "30d"
                        ? "This month"
                        : chartRange === "14d"
                        ? "Last 14 days"
                        : chartRange === "7d"
                        ? "Last 7 days"
                        : "Last 3 days"}
                    </span>
                    <div className="inline-flex rounded-full bg-muted/40 p-1 text-xs">
                      {CHART_RANGE_OPTIONS.map((opt) => (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => setChartRange(opt.key)}
                          className={cn(
                            "rounded-full px-2.5 py-1 transition-colors",
                            chartRange === opt.key
                              ? "bg-background text-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{ top: 10, right: 16, left: 8, bottom: 8 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-muted"
                      />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        className="text-muted-foreground"
                      />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        tickFormatter={(v) =>
                          v >= 1000 ? `${v / 1000}K` : String(v)
                        }
                        className="text-muted-foreground"
                      />
                      <Tooltip
                        formatter={(value: number | undefined) =>
                          formatCurrency(value ?? 0, currency)
                        }
                        labelStyle={{ color: "var(--foreground)" }}
                        contentStyle={{
                          backgroundColor: "var(--background)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="received"
                        name="Received"
                        stroke="#10b981"
                        strokeWidth={2.4}
                        dot={false}
                        activeDot={{ r: 4, strokeWidth: 0, fill: "#10b981" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="invoiced"
                        name="Invoiced"
                        stroke="#9ca3af"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        dot={false}
                        activeDot={{ r: 4, strokeWidth: 0, fill: "#9ca3af" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
                <h3 className="mb-4 font-semibold text-foreground">
                  Quick Invoice
                </h3>
                <p className="mb-5 text-sm text-muted-foreground">
                  Your customers — send invoices or request payment
                </p>
                <div className="mb-6 flex flex-wrap gap-5">
                  {quickTransferCustomers.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No customers yet. Add customers to see them here.
                    </p>
                  ) : (
                    quickTransferCustomers.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() =>
                          navigate("/dashboard/invoices/new", {
                            state: { customerId: c.id },
                          })
                        }
                        className="flex flex-col items-center gap-1.5 transition-opacity hover:opacity-80"
                      >
                        <CustomerAvatar name={c.name} size={48} />
                        <span className="max-w-[72px] truncate text-xs font-medium text-foreground">
                          {c.name}
                        </span>
                      </button>
                    ))
                  )}
                </div>
                <div className="flex gap-3">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => navigate("/dashboard/invoices/new")}
                  >
                    <Send className="mr-1.5 h-4 w-4" />
                    Send
                  </Button>
                </div>
              </div>
            </div>

            {/* Recent Transactions + Upcoming Payments & Expenses */}
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="rounded-xl border border-border bg-background shadow-sm lg:col-span-2">
                <div className="border-b border-border px-6 py-5">
                  <h3 className="font-semibold text-foreground">
                    Recent Transactions
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="px-6 py-4 text-left font-medium text-muted-foreground">
                          Name
                        </th>
                        <th className="px-6 py-4 text-left font-medium text-muted-foreground">
                          Date
                        </th>
                        <th className="px-6 py-4 text-left font-medium text-muted-foreground">
                          Status
                        </th>
                        <th className="px-6 py-4 text-right font-medium text-muted-foreground">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentPaginated.length === 0 ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-6 py-10 text-center text-muted-foreground"
                          >
                            No transactions yet. Create an invoice to get
                            started.
                          </td>
                        </tr>
                      ) : (
                        recentPaginated.map((inv) => (
                          <tr
                            key={inv.id}
                            className="border-b border-border transition-colors hover:bg-muted/20"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2.5">
                                <CustomerAvatar name={inv.customerName} size={28} />
                                <span className="font-medium text-foreground">
                                  {inv.customerName}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-muted-foreground">
                              {new Date(
                                inv.dueDate || inv.createdAt
                              ).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </td>
                            <td className="px-6 py-4">
                              <StatusBadge status={inv.status} />
                            </td>
                            <td className="px-6 py-4 text-right font-medium text-foreground">
                              {formatCurrency(inv.amount, inv.currency)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                {totalRecentPages > 1 && (
                  <div className="flex items-center justify-between border-t border-border px-6 py-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={recentPage === 0}
                      onClick={() => setRecentPage((p) => Math.max(0, p - 1))}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {recentPage + 1} of {totalRecentPages}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={
                        recentPage >= totalRecentPages - 1
                      }
                      onClick={() =>
                        setRecentPage((p) =>
                          Math.min(totalRecentPages - 1, p + 1)
                        )
                      }
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
                <h3 className="mb-5 font-semibold text-foreground">
                  Upcoming Payments & Receivables
                </h3>
                <div className="space-y-8">
                  <div>
                    <div className="mb-3 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Payments received
                      </span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(stats?.totalPaid ?? 0, currency)}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-emerald-500 transition-all"
                        style={{
                          width: `${
                            (stats?.totalPaid ?? 0) +
                              (stats?.totalOutstanding ?? 0) >
                            0
                              ? Math.min(
                                  100,
                                  (100 * (stats?.totalPaid ?? 0)) /
                                    ((stats?.totalPaid ?? 0) +
                                      (stats?.totalOutstanding ?? 0))
                                )
                              : 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="mb-3 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Outstanding
                      </span>
                      <span className="font-semibold text-amber-600 dark:text-amber-400">
                        {formatCurrency(
                          stats?.totalOutstanding ??
                            (stats ? stats.totalSent + stats.totalOverdue : 0),
                          currency
                        )}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-amber-500 transition-all"
                        style={{
                          width: `${
                            (stats?.totalPaid ?? 0) +
                              (stats?.totalOutstanding ?? 0) >
                            0
                              ? Math.min(
                                  100,
                                  (100 *
                                    (stats?.totalOutstanding ??
                                      (stats
                                        ? stats.totalSent + stats.totalOverdue
                                        : 0))) /
                                    ((stats?.totalPaid ?? 0) +
                                      (stats?.totalOutstanding ?? 0))
                                )
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
                <p className="mt-6 text-xs text-muted-foreground">
                  Receivables overview — paid vs outstanding
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
