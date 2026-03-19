import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AcmeHero } from "@/components/ui/acme-hero";
import { Problem } from "@/components/landing/Problem";
import { Features } from "@/components/landing/Features";
import Pricing from "@/components/ui/pricing-component";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";

const NAV_SECTIONS = [
  "overview",
  "about",
  "features",
  "pricing",
  "faq",
] as const;
export type NavSection = (typeof NAV_SECTIONS)[number];

export function LandingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeNavSection, setActiveNavSection] = useState<NavSection>("overview");

  // On refresh: always show home from top (clear hash and scroll to top)
  useEffect(() => {
    const navEntry = performance.getEntriesByType?.("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    const isReload = navEntry?.type === "reload";
    if (isReload && location.pathname === "/") {
      setActiveNavSection("overview");
      navigate({ pathname: "/", hash: "" }, { replace: true });
      window.scrollTo(0, 0);
      return;
    }
  }, [navigate, location.pathname]);

  // Sync active section from URL hash on load (only when not a refresh)
  useEffect(() => {
    const hash = location.hash?.replace("#", "") || "";
    if (hash && NAV_SECTIONS.includes(hash as NavSection)) {
      setActiveNavSection(hash as NavSection);
    }
  }, [location.hash]);

  // Scroll to section when hash or tab changes (incl. when navigating from another page)
  useEffect(() => {
    const navEntry = performance.getEntriesByType?.("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    if (navEntry?.type === "reload" && location.pathname === "/") return;

    const hash = location.hash || window.location.hash;
    if (hash) {
      const id = hash.replace("#", "");
      const scrollToEl = () => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      };
      // Delay scroll so DOM/layout is ready (e.g. when navigating from footer on another page)
      const t = setTimeout(scrollToEl, 120);
      return () => clearTimeout(t);
    }
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.pathname, location.hash]);

  // Scroll spy: set active nav from scroll position
  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      let active: NavSection = "overview";
      for (const id of NAV_SECTIONS) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const top = rect.top + scrollY;
          if (scrollY >= top - 100) active = id;
        }
      }
      setActiveNavSection(active);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavChange = useCallback(
    (value: string) => {
      setActiveNavSection(value as NavSection);
      // Update URL hash so scroll effect runs and scroll is reliable
      if (value === "overview") {
        navigate("/", { replace: true });
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate(`/#${value}`, { replace: true });
        requestAnimationFrame(() => {
          const el = document.getElementById(value);
          el?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    },
    [navigate]
  );

  return (
    <div className="flex min-h-screen min-w-0 flex-col overflow-x-hidden bg-background font-sans text-foreground antialiased">
      <main className="flex-1">
        <AcmeHero
          activeNavSection={activeNavSection}
          onNavChange={handleNavChange}
        />
        <Problem />
        <Features />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
