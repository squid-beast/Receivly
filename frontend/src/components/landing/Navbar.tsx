import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "About", sectionId: "about" },
  { label: "Features", sectionId: "features" },
  { label: "Pricing", sectionId: "pricing" },
  { label: "FAQ", sectionId: "faq" },
] as const;

export function Navbar({ onNavChange }: { onNavChange?: (section: string) => void }) {
  const { toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-sm"
          : "bg-transparent"
      )}
    >
      <Container>
        <nav className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-lg font-bold font-display text-foreground">
              Receivly
            </span>
          </Link>

          <div className="hidden md:flex md:items-center md:gap-x-1">
            {navLinks.map((link) =>
              onNavChange ? (
                <button
                  key={link.sectionId}
                  type="button"
                  onClick={() => onNavChange(link.sectionId)}
                  className="rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.sectionId}
                  to={`/#${link.sectionId}`}
                  className="rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          <div className="hidden md:flex md:items-center md:gap-x-3">
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
            <Link to="/signin">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
          </div>

          <button
            type="button"
            className="md:hidden -m-2 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-accent"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </Container>

      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop - tap outside to close on mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="fixed inset-x-0 top-16 z-50 overflow-hidden border-b border-border bg-background/95 backdrop-blur-xl md:hidden"
            >
            <Container className="pb-6 pt-2">
              <div className="space-y-1">
                {navLinks.map((link) =>
                  onNavChange ? (
                    <button
                      key={link.sectionId}
                      type="button"
                      className="flex min-h-[44px] w-full items-center rounded-lg px-3 py-3 text-left text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                      onClick={() => {
                        onNavChange(link.sectionId);
                        setMobileOpen(false);
                      }}
                    >
                      {link.label}
                    </button>
                  ) : (
                    <Link
                      key={link.sectionId}
                      to={`/#${link.sectionId}`}
                      className="flex min-h-[44px] items-center rounded-lg px-3 py-3 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  )
                )}
              </div>
              <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
                <Button
                  variant="ghost"
                  className="min-h-[44px] w-full justify-center gap-2"
                  aria-label="Toggle theme"
                  onClick={() => {
                    toggleTheme();
                    setMobileOpen(false);
                  }}
                >
                  <Sun className="h-4 w-4 shrink-0 dark:hidden" />
                  <Moon className="hidden h-4 w-4 shrink-0 dark:block" />
                  Toggle theme
                </Button>
                <Link to="/signin" className="w-full" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className="min-h-[44px] w-full justify-center">
                    Sign in
                  </Button>
                </Link>
              </div>
            </Container>
          </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
