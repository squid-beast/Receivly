import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import {
  FileText,
  Loader2,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Plus,
  ArrowRight,
} from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { MetricsCard } from "@/components/ui/MetricsCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

interface DashboardStats {
  totalSent: number;
  totalOverdue: number;
  totalPaid: number;
  countSent: number;
  countOverdue: number;
  countPaid: number;
  currency: string;
}

interface RecentInvoice {
  id: string;
  invoiceNumber: string;
  description: string;
  amount: number;
  currency: string;
  status: string;
  dueDate: string;
  customerName: string;
}

export function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentInvoices, setRecentInvoices] = useState<RecentInvoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/dashboard/stats"), api.get("/invoices")])
      .then(([statsRes, invRes]) => {
        setStats(statsRes.data);
        setRecentInvoices(invRes.data.slice(0, 5));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const formatCurrency = (amount: number, currency: string) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
      amount
    );

  const totalInvoices =
    stats ? stats.countSent + stats.countOverdue + stats.countPaid : 0;

  return (
    <AppLayout>
      <PageHeader
        title={`Welcome back, ${user?.fullName?.split(" ")[0]}`}
        description={user?.businessName}
      />

      {loading ? (
        <div className="mt-12 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* Metrics */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricsCard
              label="Total Sent"
              value={
                stats ? formatCurrency(stats.totalSent, stats.currency) : "$0"
              }
              subtitle={`${stats?.countSent ?? 0} invoice${stats?.countSent !== 1 ? "s" : ""}`}
              icon={DollarSign}
              iconClassName="bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400"
            />
            <MetricsCard
              label="Overdue"
              value={
                stats
                  ? formatCurrency(stats.totalOverdue, stats.currency)
                  : "$0"
              }
              subtitle={`${stats?.countOverdue ?? 0} invoice${stats?.countOverdue !== 1 ? "s" : ""}`}
              icon={AlertCircle}
              iconClassName="bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400"
              valueClassName="text-red-600 dark:text-red-400"
            />
            <MetricsCard
              label="Collected"
              value={
                stats ? formatCurrency(stats.totalPaid, stats.currency) : "$0"
              }
              subtitle={`${stats?.countPaid ?? 0} invoice${stats?.countPaid !== 1 ? "s" : ""}`}
              icon={CheckCircle2}
              iconClassName="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
              valueClassName="text-emerald-600 dark:text-emerald-400"
            />
            <MetricsCard
              label="Total Invoices"
              value={String(totalInvoices)}
              subtitle="All time"
              icon={FileText}
              iconClassName="bg-primary/10 text-primary"
            />
          </div>

          {/* Recent Invoices */}
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-sm font-semibold text-foreground">
                Recent Invoices
              </h2>
              {recentInvoices.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/dashboard/invoices")}
                  className="text-xs text-muted-foreground"
                >
                  View all
                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              )}
            </div>

            {totalInvoices === 0 ? (
              <EmptyState
                icon={FileText}
                title="No invoices yet"
                description="Create your first invoice to get started."
                className="mt-4"
              >
                <Button onClick={() => navigate("/dashboard/invoices")}>
                  <Plus className="mr-1.5 h-4 w-4" />
                  Create Invoice
                </Button>
              </EmptyState>
            ) : (
              <div className="mt-3 overflow-hidden rounded-xl border border-border bg-background shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/40">
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Invoice
                        </th>
                        <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:table-cell">
                          Customer
                        </th>
                        <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">
                          Due Date
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentInvoices.map((inv, idx) => (
                        <tr
                          key={inv.id}
                          onClick={() => navigate("/dashboard/invoices")}
                          className={cn(
                            "cursor-pointer transition-colors hover:bg-muted/30",
                            idx !== recentInvoices.length - 1 &&
                              "border-b border-border/60"
                          )}
                        >
                          <td className="px-4 py-3.5">
                            <StatusBadge status={inv.status} />
                          </td>
                          <td className="px-4 py-3.5">
                            <div>
                              <p className="font-semibold text-foreground">
                                {inv.invoiceNumber}
                              </p>
                              <p className="text-xs text-muted-foreground line-clamp-1">
                                {inv.description}
                              </p>
                            </div>
                          </td>
                          <td className="hidden px-4 py-3.5 text-muted-foreground sm:table-cell">
                            {inv.customerName}
                          </td>
                          <td className="hidden px-4 py-3.5 text-muted-foreground md:table-cell">
                            {new Date(inv.dueDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </td>
                          <td className="px-4 py-3.5 text-right font-semibold text-foreground">
                            {formatCurrency(inv.amount, inv.currency)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </AppLayout>
  );
}
