import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import { FileText, Loader2, DollarSign, AlertCircle, CheckCircle2, Plus, ArrowRight } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { MetricsCard } from "@/components/ui/MetricsCard";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
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
    Promise.all([
      api.get("/dashboard/stats"),
      api.get("/invoices"),
    ])
      .then(([statsRes, invRes]) => {
        setStats(statsRes.data);
        setRecentInvoices(invRes.data.slice(0, 5));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  };

  const totalInvoices = stats ? stats.countSent + stats.countOverdue + stats.countPaid : 0;

  return (
    <AppLayout>
      <PageHeader
        title={`Welcome back, ${user?.fullName}`}
        description={user?.businessName}
      />

      {loading ? (
        <div className="mt-12 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* Metrics Row */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricsCard
              label="Total Sent"
              value={stats ? formatCurrency(stats.totalSent, stats.currency) : "$0"}
              subtitle={`${stats?.countSent ?? 0} invoice${stats?.countSent !== 1 ? "s" : ""}`}
              icon={DollarSign}
              iconClassName="bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400"
            />
            <MetricsCard
              label="Overdue"
              value={stats ? formatCurrency(stats.totalOverdue, stats.currency) : "$0"}
              subtitle={`${stats?.countOverdue ?? 0} invoice${stats?.countOverdue !== 1 ? "s" : ""}`}
              icon={AlertCircle}
              iconClassName="bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400"
              valueClassName="text-destructive"
            />
            <MetricsCard
              label="Paid"
              value={stats ? formatCurrency(stats.totalPaid, stats.currency) : "$0"}
              subtitle={`${stats?.countPaid ?? 0} invoice${stats?.countPaid !== 1 ? "s" : ""}`}
              icon={CheckCircle2}
              iconClassName="bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400"
              valueClassName="text-green-600 dark:text-green-400"
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
              <h2 className="text-sm font-medium text-foreground">Recent Invoices</h2>
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
              <div className="mt-3">
                <DataTable
                  columns={[
                    {
                      key: "invoice",
                      header: "Invoice",
                      render: (inv: RecentInvoice) => (
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
                      render: (inv: RecentInvoice) => (
                        <span className="text-muted-foreground">{inv.customerName}</span>
                      ),
                    },
                    {
                      key: "amount",
                      header: "Amount",
                      className: "text-right",
                      headerClassName: "text-right",
                      render: (inv: RecentInvoice) => (
                        <span className="font-medium text-foreground">
                          {formatCurrency(inv.amount, inv.currency)}
                        </span>
                      ),
                    },
                    {
                      key: "status",
                      header: "Status",
                      render: (inv: RecentInvoice) => <StatusBadge status={inv.status} />,
                    },
                  ]}
                  data={recentInvoices}
                  keyExtractor={(inv) => inv.id}
                  onRowClick={() => navigate("/dashboard/invoices")}
                />
              </div>
            )}
          </div>
        </>
      )}
    </AppLayout>
  );
}
