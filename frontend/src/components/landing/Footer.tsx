import { Link, useLocation, useNavigate } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { FOOTER_PADDING } from "@/components/landing/landing-section";

const LANDING_SECTIONS = ["overview", "about", "features", "pricing", "faq"] as const;

const productLinks = [
  { label: "Overview", href: "/", scrollToTop: true },
  { label: "Pricing", href: "/#pricing" },
  { label: "Features", href: "/#features" },
];

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
];

const resourcesLinks = [
  { label: "Help", href: "/help" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

function scrollToSection(href: string) {
  const hash = href.includes("#") ? href.split("#")[1] : "";
  if (!hash || hash === "overview") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  if (LANDING_SECTIONS.includes(hash as (typeof LANDING_SECTIONS)[number])) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = document.getElementById(hash);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }
}

function LinkColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string; scrollToTop?: boolean }[];
}) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xs font-semibold text-foreground">{title}</h3>
      <ul className="flex flex-col gap-1.5">
        {links.map((link) => {
          const isInternal = link.href.startsWith("/");
          const hasHash = link.href.includes("#");
          const isOverviewOnHome =
            link.scrollToTop && link.href === "/" && location.pathname === "/";

          if (isInternal) {
            const handleHashOrOverviewClick =
              hasHash || isOverviewOnHome
                ? (e: React.MouseEvent) => {
                    if (location.pathname !== "/") return; // let Link navigate
                    e.preventDefault();
                    navigate(link.href);
                    setTimeout(
                      () => scrollToSection(link.href),
                      location.pathname === "/" ? 50 : 0
                    );
                  }
                : undefined;
            return (
              <li key={link.label}>
                <Link
                  to={link.href}
                  className="flex min-h-[44px] min-w-[44px] items-center py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground sm:min-h-0 sm:min-w-0 sm:py-0"
                  onClick={handleHashOrOverviewClick}
                >
                  {link.label}
                </Link>
              </li>
            );
          }
          return (
            <li key={link.label}>
              <a
                href={link.href}
                className="flex min-h-[44px] min-w-[44px] items-center py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground sm:min-h-0 sm:min-w-0 sm:py-0"
              >
                {link.label}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-background">
      <Container className={FOOTER_PADDING}>
        <div className="grid grid-cols-2 gap-4 gap-y-4 sm:gap-6 md:grid-cols-4 lg:gap-8">
          {/* Brand column */}
          <div className="col-span-2 flex flex-col gap-1 md:col-span-1">
            <p className="text-sm font-bold font-display text-foreground">
              Receivly
            </p>
            <p className="text-xs text-muted-foreground">
              Track What You're Owed.
            </p>
          </div>

          <LinkColumn title="Product" links={productLinks} />
          <LinkColumn title="Company" links={companyLinks} />
          <LinkColumn title="Resources" links={resourcesLinks} />
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-border pt-4 pb-[env(safe-area-inset-bottom)] sm:flex-row sm:pb-0">
          <p className="text-xs text-muted-foreground">
            © {year} Receivly. All rights reserved.
          </p>
          <nav className="flex flex-wrap justify-center gap-3 sm:gap-4">
            <Link
              to="/terms"
              className="flex min-h-[44px] min-w-[44px] items-center justify-center py-2 text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline sm:min-h-0 sm:min-w-0 sm:py-0 sm:justify-start"
            >
              Terms and Conditions
            </Link>
            <Link
              to="/privacy"
              className="flex min-h-[44px] min-w-[44px] items-center justify-center py-2 text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline sm:min-h-0 sm:min-w-0 sm:py-0 sm:justify-start"
            >
              Privacy Policy
            </Link>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
