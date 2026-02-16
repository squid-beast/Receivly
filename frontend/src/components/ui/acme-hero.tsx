import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import type { NavSection } from "@/pages/LandingPage";

export function AcmeHero(_props: {
  activeNavSection: NavSection;
  onNavChange: (section: string) => void;
}) {
  return (
    <section id="overview">
      <Navbar />
      <HeroHighlight containerClassName="pt-32 pb-20 sm:pt-40 sm:pb-28">
        <Container className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] as const }}
          >
            <span className="mb-6 inline-flex items-center rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 dark:border-white/10 dark:bg-white/5 dark:text-white/80">
              Now in Beta
            </span>
          </motion.div>

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
            Stop chasing payments.{" "}
            <Highlight>Get paid on time.</Highlight>
          </motion.h1>

          <motion.p
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.2,
              ease: [0.21, 0.47, 0.32, 0.98] as const,
            }}
          >
            Receivly is simple invoicing for small businesses. Create invoices,
            send automatic reminders, and track payments — all in one place.
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
                size="lg"
                className="min-h-[48px] bg-foreground text-background hover:bg-foreground/90 sm:min-h-0"
              >
                Start Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/#features">
              <Button
                variant="outline"
                size="lg"
                className="min-h-[48px] sm:min-h-0"
              >
                See Features
              </Button>
            </Link>
          </motion.div>
        </Container>
      </HeroHighlight>
    </section>
  );
}
