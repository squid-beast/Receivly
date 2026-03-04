import { TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

const rows = [
  { customer: "ABC Tech Solutions", amount: "$1,200.00", date: "Jan 15, 2026", status: "Overdue" as const },
  { customer: "BrightEdge Agency", amount: "$2,000.00", date: "Feb 01, 2026", status: "Sent" as const },
  { customer: "Nova Consulting", amount: "$1,400.00", date: "Feb 10, 2026", status: "Paid" as const },
  { customer: "Pinnacle Corp", amount: "$3,640.00", date: "Feb 12, 2026", status: "Sent" as const },
];

const statusConfig = {
  Overdue: { variant: "destructive" as const },
  Sent: { variant: "warning" as const },
  Paid: { variant: "success" as const },
};

const metrics = [
  { label: "Outstanding", value: "$8,240", icon: TrendingUp, color: "text-primary-600", bg: "bg-primary-50" },
  { label: "Overdue", value: "3 invoices", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
  { label: "Paid this week", value: "$4,600", icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
];

export function DashboardMock() {
  return (
    <div className="min-w-0 overflow-hidden rounded-2xl border border-border bg-background shadow-2xl shadow-foreground/5">
      <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
          <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
          <span className="h-3 w-3 rounded-full bg-[#28C840]" />
        </div>
        <div className="ml-3 flex-1">
          <div className="mx-auto max-w-md rounded-md bg-background border border-border px-3 py-1 text-xs text-muted-foreground text-center">
            app.receivly.com/dashboard
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-8">
        <div className="flex gap-6">
          <div className="hidden sm:flex flex-col gap-1 w-40 shrink-0">
            <div className="flex items-center gap-2 rounded-lg bg-primary-50 px-3 py-2 text-xs font-medium text-primary-700">
              <TrendingUp className="h-3.5 w-3.5" />
              Dashboard
            </div>
            {["Invoices", "Customers", "Reminders", "Settings"].map((item) => (
              <div key={item} className="rounded-lg px-3 py-2 text-xs text-muted-foreground hover:bg-muted transition-colors cursor-default">
                {item}
              </div>
            ))}
          </div>

          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 mb-6">
              {metrics.map((m) => (
                <div key={m.label} className="rounded-xl border border-border bg-background p-4 transition-shadow hover:shadow-md">
                  <div className="flex items-center gap-2">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${m.bg}`}>
                      <m.icon className={`h-4 w-4 ${m.color}`} />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">{m.label}</span>
                  </div>
                  <p className={`mt-2 text-xl font-bold ${m.color}`}>{m.value}</p>
                </div>
              ))}
            </div>

            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Customer</th>
                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Amount</th>
                    <th className="hidden sm:table-cell px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Date</th>
                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rows.map((r) => {
                    const config = statusConfig[r.status];
                    return (
                      <tr key={r.customer} className="transition-colors hover:bg-muted/30">
                        <td className="px-4 py-3 font-medium text-foreground">{r.customer}</td>
                        <td className="px-4 py-3 text-muted-foreground tabular-nums">{r.amount}</td>
                        <td className="hidden sm:table-cell px-4 py-3 text-muted-foreground">{r.date}</td>
                        <td className="px-4 py-3 text-right">
                          <Badge variant={config.variant}>{r.status}</Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
