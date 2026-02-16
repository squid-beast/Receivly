import { Link, useLocation } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { FOOTER_PADDING } from "@/components/landing/landing-section";

const productLinks = [
  { label: "Overview", href: "/", scrollToTop: true },
  { label: "Pricing", href: "/#pricing" },
  { label: "Features", href: "/#features" },
];

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
];

const resourcesLinks = [
  { label: "Help", href: "/help" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

const socialLinks = [
  { label: "Twitter", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "LinkedIn", href: "#" },
];

function LinkColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string; scrollToTop?: boolean }[];
}) {
  const location = useLocation();

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <ul className="flex flex-col gap-3">
        {links.map((link) => {
          const isInternal = link.href.startsWith("/");
          const isOverviewOnHome =
            link.scrollToTop && link.href === "/" && location.pathname === "/";
          return (
            <li key={link.label}>
              {isInternal ? (
                <Link
                  to={link.href}
                  className="block min-h-[44px] py-2 text-sm text-muted-foreground transition-colors hover:text-foreground sm:min-h-0 sm:py-0"
                  onClick={
                    isOverviewOnHome
                      ? () => window.scrollTo({ top: 0, behavior: "smooth" })
                      : undefined
                  }
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  href={link.href}
                  className="block min-h-[44px] py-2 text-sm text-muted-foreground transition-colors hover:text-foreground sm:min-h-0 sm:py-0"
                >
                  {link.label}
                </a>
              )}
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
    <footer className="border-t border-border bg-background">
      <Container className={FOOTER_PADDING}>
        <div className="grid grid-cols-2 gap-6 gap-y-8 sm:gap-8 md:grid-cols-4 lg:grid-cols-5 lg:gap-12">
          {/* Brand column */}
          <div className="col-span-2 flex flex-col gap-4 md:col-span-1">
            <p className="text-base font-bold font-display text-foreground">
              Receivly
            </p>
            <p className="text-sm text-muted-foreground">
              Simple invoicing for small businesses.
            </p>
          </div>

          <LinkColumn title="Product" links={productLinks} />
          <LinkColumn title="Company" links={companyLinks} />
          <LinkColumn title="Resources" links={resourcesLinks} />
          <LinkColumn title="Social" links={socialLinks} />
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {year} Receivly. All rights reserved.
          </p>
          <nav className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <Link
              to="/terms"
              className="min-h-[44px] py-2 text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline sm:min-h-0 sm:py-0"
            >
              Terms and Conditions
            </Link>
            <Link
              to="/privacy"
              className="min-h-[44px] py-2 text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline sm:min-h-0 sm:py-0"
            >
              Privacy Policy
            </Link>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
