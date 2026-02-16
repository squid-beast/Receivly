import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { KeywordHighlight } from "@/components/ui/keyword-highlight";
import { SECTION_PADDING, CONTENT_MAX_W } from "@/components/landing/landing-section";
import { cn } from "@/lib/utils";

const MISSION_PARAGRAPH =
  "We are rethinking getting paid to be more reliable and always you-first. Our goal is to continually raise the bar and challenge how invoicing could work for you.";

const KEYWORDS = [
  { text: "rethinking", colorClass: "text-blue-600 border-blue-600 dark:text-blue-400 dark:border-blue-400", delay: 0.2 },
  { text: "challenge", colorClass: "text-amber-600 border-amber-600 dark:text-amber-400 dark:border-amber-400", delay: 0.4 },
  { text: "work for you.", colorClass: "text-emerald-600 border-emerald-600 dark:text-emerald-400 dark:border-emerald-400", delay: 0.6 },
];

export function Problem() {
  return (
    <section id="about" className={SECTION_PADDING}>
      <Container>
        <SectionHeading
          badge="About"
          title="Invoicing shouldn't take 10+ hours every week"
        />
        <AnimatedSection delay={0.15} className={cn("mx-auto text-center", CONTENT_MAX_W)}>
          <KeywordHighlight
            paragraph={MISSION_PARAGRAPH}
            keywords={KEYWORDS}
            textClassName="text-muted-foreground"
          />
        </AnimatedSection>
      </Container>
    </section>
  );
}
