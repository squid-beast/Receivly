import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/Button";
import {
  LogOut,
  FileText,
  Users,
  Settings,
  LayoutDashboard,
  Menu,
  X,
  Sun,
  Moon,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const primaryNav = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Customers", href: "/dashboard/customers", icon: Users },
  { label: "Invoices", href: "/dashboard/invoices", icon: FileText },
];

const secondaryNav = [
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, signout } = useAuth();
  const { toggleTheme } = useTheme();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderNavItem = (item: (typeof primaryNav)[0], onClick?: () => void) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.href;
    return (
      <Link
        key={item.href}
        to={item.href}
        onClick={onClick}
        className={cn(
          "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-accent hover:text-foreground"
        )}
      >
        <Icon
          className={cn(
            "h-4 w-4 shrink-0",
            isActive
              ? "text-primary"
              : "text-muted-foreground group-hover:text-foreground"
          )}
        />
        {item.label}
        {isActive && (
          <ChevronRight className="ml-auto h-3.5 w-3.5 text-primary/50" />
        )}
      </Link>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-background lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="text-lg font-bold font-display text-foreground">
              Receivly
            </span>
          </Link>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
          <p className="mb-1 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
            Main
          </p>
          {primaryNav.map((item) => renderNavItem(item))}

          <div className="mt-auto">
            <p className="mb-1 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
              Account
            </p>
            {secondaryNav.map((item) => renderNavItem(item))}
          </div>
        </nav>

        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-foreground">
                {user?.fullName}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {user?.businessName}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={signout}
              className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{
                duration: 0.25,
                ease: [0.21, 0.47, 0.32, 0.98] as const,
              }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] border-r border-border bg-background lg:hidden"
            >
              <div className="flex h-16 items-center justify-between border-b border-border px-6">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2"
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="text-lg font-bold font-display text-foreground">
                    Receivly
                  </span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
                <p className="mb-1 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
                  Main
                </p>
                {primaryNav.map((item) =>
                  renderNavItem(item, () => setSidebarOpen(false))
                )}

                <div className="mt-8">
                  <p className="mb-1 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
                    Account
                  </p>
                  {secondaryNav.map((item) =>
                    renderNavItem(item, () => setSidebarOpen(false))
                  )}
                </div>
              </nav>

              <div className="border-t border-border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-medium text-foreground">
                      {user?.fullName}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user?.businessName}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={signout}
                    className="h-8 w-8 shrink-0 text-muted-foreground"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex h-16 shrink-0 items-center gap-4 border-b border-border bg-background px-4 lg:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex-1" />

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="relative h-8 w-8 shrink-0"
              aria-label="Toggle theme"
              onClick={toggleTheme}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            <div className="flex items-center gap-3 lg:hidden">
              <span className="text-sm font-medium text-foreground">
                {user?.businessName}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
