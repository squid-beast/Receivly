import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import {
  LogOut,
  FileText,
  Users,
  Settings,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Customers", href: "/dashboard/customers", icon: Users },
  { label: "Invoices", href: "/dashboard/invoices", icon: FileText },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, signout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background">
        <Container>
          <nav className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-6">
              <Link
                to="/dashboard"
                className="text-lg font-bold font-display text-foreground"
              >
                Receivly
              </Link>
              <div className="hidden items-center gap-1 sm:flex">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={cn(
                        "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-accent text-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                    >
                      <span className="flex items-center gap-1.5">
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-muted-foreground sm:inline">
                {user?.businessName}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={signout}
                className="text-muted-foreground"
              >
                <LogOut className="mr-1.5 h-4 w-4" />
                Sign out
              </Button>
            </div>
          </nav>
        </Container>
      </header>

      {/* Mobile nav */}
      <div className="border-b border-border sm:hidden">
        <Container>
          <div className="flex gap-1 overflow-x-auto py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium",
                    isActive
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </Container>
      </div>

      <Container className="py-8">{children}</Container>
    </div>
  );
}
