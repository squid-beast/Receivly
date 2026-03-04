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
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { CustomerAvatar } from "@/components/ui/customer-avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const mainNav = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Customers", href: "/dashboard/customers", icon: Users },
  { label: "Invoices", href: "/dashboard/invoices", icon: FileText },
];

const preferenceNav = [
  { label: "Help & Support", href: "/dashboard/help", icon: HelpCircle },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, signout } = useAuth();
  const { toggleTheme } = useTheme();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem("receivly-sidebar-collapsed") === "true";
    } catch {
      return false;
    }
  });

  const setCollapsedPersisted = (value: boolean) => {
    setCollapsed(value);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("receivly-sidebar-collapsed", String(value));
      } catch {
        // ignore
      }
    }
  };

  const isActive = (href: string) =>
    location.pathname === href ||
    (href !== "/dashboard" && location.pathname.startsWith(href));

  /* ─── Expanded nav item ─── */
  const renderExpandedItem = (
    item: (typeof mainNav)[0],
    onClick?: () => void
  ) => {
    const Icon = item.icon;
    const active = isActive(item.href);
    return (
      <Link
        key={item.href}
        to={item.href}
        onClick={onClick}
        className={cn(
          "group flex items-center gap-4 rounded-xl px-4 py-3 text-[15px] font-medium transition-all",
          active
            ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
            : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-gray-100"
        )}
      >
        <Icon
          className={cn(
            "h-[22px] w-[22px] shrink-0",
            active
              ? "text-gray-900 dark:text-gray-50"
              : "text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300"
          )}
        />
        {item.label}
      </Link>
    );
  };

  /* ─── Collapsed nav item (icon-only with left accent) ─── */
  const renderCollapsedItem = (item: (typeof mainNav)[0]) => {
    const Icon = item.icon;
    const active = isActive(item.href);
    return (
      <Tooltip key={item.href} delayDuration={0}>
        <TooltipTrigger asChild>
          <Link
            to={item.href}
            className={cn(
              "relative flex h-11 w-11 items-center justify-center rounded-xl transition-all",
              active
                ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
                : "text-gray-400 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-500 dark:hover:bg-gray-800/60 dark:hover:text-gray-200"
            )}
          >
            {active && (
              <span className="absolute -left-[18px] top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-emerald-600 dark:bg-emerald-500" />
            )}
            <Icon className="h-[22px] w-[22px]" />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={12}>
          {item.label}
        </TooltipContent>
      </Tooltip>
    );
  };

  return (
    <TooltipProvider>
      <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-background">
        {/* ─── Desktop Sidebar ─── */}
        <aside
          className={cn(
            "hidden shrink-0 flex-col bg-gray-50/80 transition-all duration-300 dark:bg-gray-950 lg:flex",
            collapsed ? "w-[76px]" : "w-64"
          )}
        >
          {collapsed ? (
            /* ── Collapsed view ── */
            <div className="flex h-full flex-col items-center">
              {/* Logo icon */}
              <div className="pb-4 pt-7">
                <Link
                  to="/dashboard"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-base font-bold text-white dark:bg-emerald-500"
                >
                  R
                </Link>
              </div>

              {/* Main section */}
              <p className="mb-3 mt-6 text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400 dark:text-gray-500">
                Main
              </p>
              <nav className="flex flex-col items-center gap-2">
                {mainNav.map((item) => renderCollapsedItem(item))}
              </nav>

              {/* Others section */}
              <p className="mb-3 mt-8 text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400 dark:text-gray-500">
                Others
              </p>
              <nav className="flex flex-col items-center gap-2">
                {preferenceNav.map((item) => renderCollapsedItem(item))}
              </nav>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Bottom: expand + logout + avatar */}
              <div className="flex flex-col items-center gap-3 pb-6">
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => setCollapsedPersisted(false)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={12}>
                    Expand sidebar
                  </TooltipContent>
                </Tooltip>

                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={signout}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-gray-500 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                    >
                      <LogOut className="h-5 w-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={12}>
                    Logout
                  </TooltipContent>
                </Tooltip>

                <CustomerAvatar name={user?.fullName || "User"} size={40} />
              </div>
            </div>
          ) : (
            /* ── Expanded view ── */
            <div className="flex h-full flex-col">
              {/* Logo */}
              <div className="px-7 pb-2 pt-8">
                <Link to="/dashboard" className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-sm font-bold text-white dark:bg-emerald-500">
                    R
                  </span>
                  <span className="text-xl font-bold font-display text-foreground">
                    Receivly
                  </span>
                </Link>
              </div>

              {/* User / workspace block */}
              <div className="px-5 pb-2 pt-7">
                <div className="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3.5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                  <CustomerAvatar name={user?.fullName || "User"} size={40} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {user?.businessName || user?.fullName}
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500" />
                </div>
              </div>

              {/* Main Menu */}
              <nav className="flex-1 px-5 pt-6">
                <p className="mb-4 px-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400 dark:text-gray-500">
                  Main Menu
                </p>
                <div className="space-y-1">
                  {mainNav.map((item) => renderExpandedItem(item))}
                </div>

                <p className="mb-4 mt-10 px-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400 dark:text-gray-500">
                  Preference
                </p>
                <div className="space-y-1">
                  {preferenceNav.map((item) => renderExpandedItem(item))}
                </div>
              </nav>

              {/* Bottom: collapse + logout */}
              <div className="border-t border-gray-200 px-5 py-4 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCollapsedPersisted(true)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Collapse
                  </button>
                  <button
                    type="button"
                    onClick={signout}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-gray-500 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* ─── Mobile Sidebar Overlay ─── */}
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
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{
                  duration: 0.25,
                  ease: [0.21, 0.47, 0.32, 0.98] as const,
                }}
                className="fixed inset-y-0 left-0 z-50 flex w-[300px] flex-col bg-gray-50/80 dark:bg-gray-950 lg:hidden"
              >
                <div className="absolute right-3 top-3 z-10">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Logo */}
                <div className="px-7 pb-2 pt-8">
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2.5"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-sm font-bold text-white dark:bg-emerald-500">
                      R
                    </span>
                    <span className="text-xl font-bold font-display text-foreground">
                      Receivly
                    </span>
                  </Link>
                </div>

                {/* User block */}
                <div className="px-5 pb-2 pt-7">
                  <div className="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3.5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                    <CustomerAvatar name={user?.fullName || "User"} size={40} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {user?.businessName || user?.fullName}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-5 pt-6">
                  <p className="mb-4 px-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400 dark:text-gray-500">
                    Main Menu
                  </p>
                  <div className="space-y-1">
                    {mainNav.map((item) =>
                      renderExpandedItem(item, () => setSidebarOpen(false))
                    )}
                  </div>
                  <p className="mb-4 mt-10 px-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400 dark:text-gray-500">
                    Preference
                  </p>
                  <div className="space-y-1">
                    {preferenceNav.map((item) =>
                      renderExpandedItem(item, () => setSidebarOpen(false))
                    )}
                  </div>
                </nav>

                {/* Bottom */}
                <div className="border-t border-gray-200 px-5 py-4 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={signout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-gray-500 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* ─── Main Content ─── */}
        <div className="flex flex-1 flex-col overflow-hidden bg-white dark:bg-background">
          {/* Top Bar */}
          <header className="flex h-14 shrink-0 items-center gap-4 border-b border-gray-200 bg-white px-5 dark:border-gray-800 dark:bg-gray-950 sm:px-6 lg:px-8">
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
            <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8">
              <div className="rounded-3xl border border-border bg-background shadow-sm">
                <div className="px-6 py-7 sm:px-8 sm:py-8">
                  {children}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
