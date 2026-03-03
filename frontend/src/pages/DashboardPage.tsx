import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { MetricsCard } from "@/components/ui/MetricsCard";
import { DollarSign, AlertCircle, CheckCircle2, FileText, Loader2 } from "lucide-react";
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

export function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/dashboard/stats")
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const formatCurrency = (amount: number, currency: string) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);

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
      )}
    </AppLayout>
  );
}

