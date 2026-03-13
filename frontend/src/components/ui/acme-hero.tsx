import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Navbar } from "@/components/landing/Navbar";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import type { NavSection } from "@/pages/LandingPage";

export function AcmeHero({
  activeNavSection: _activeNavSection,
  onNavChange,
}: {
  activeNavSection: NavSection;
  onNavChange: (section: string) => void;
}) {
  return (
    <section id="overview">
      <Navbar onNavChange={onNavChange} />
      <HeroHighlight containerClassName="pt-32 pb-20 sm:pt-40 sm:pb-28">
        <Container className="text-center">
          <motion.h1
            className="mx-auto max-w-4xl font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.1,
              ease: [0.21, 0.47, 0.32, 0.98] as const,
            }}
          >
            Invoice Faster. Get Paid Sooner.{" "}
            <Highlight>No Accounting Software Required.</Highlight>
          </motion.h1>

          <motion.p
            className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.2,
              ease: [0.21, 0.47, 0.32, 0.98] as const,
            }}
          >
            Receivly is the focused invoicing platform for small businesses and freelancers.
            Create professional invoices, track who has paid and who is overdue, and send
            automated payment reminders — all from one clean dashboard.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.3,
              ease: [0.21, 0.47, 0.32, 0.98] as const,
            }}
          >
            <Link to="/signup">
              <Button
                variant="default"
                size="lg"
                className="min-h-[48px] sm:min-h-0"
              >
                Start Free — No Credit Card Required
              </Button>
            </Link>
          </motion.div>
        </Container>
      </HeroHighlight>
    </section>
  );
}
