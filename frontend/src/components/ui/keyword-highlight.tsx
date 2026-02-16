import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface KeywordHighlightConfig {
  /** Text to highlight (must appear in the paragraph) */
  text: string;
  /** Tailwind color class for text and underline, e.g. text-blue-600 */
  colorClass: string;
  /** Optional delay in seconds for stagger */
  delay?: number;
}

interface KeywordHighlightProps {
  /** Full paragraph text. Keywords are replaced with highlighted spans. */
  paragraph: string;
  keywords: KeywordHighlightConfig[];
  className?: string;
  /** Class for the non-highlighted text */
  textClassName?: string;
}

export function KeywordHighlight({
  paragraph,
  keywords,
  className,
  textClassName = "text-foreground",
}: KeywordHighlightProps) {
  type Part = { type: "text" | "keyword"; content: string; config?: KeywordHighlightConfig };
  const parts: Part[] = [];
  let pos = 0;

  while (pos < paragraph.length) {
    let found: { kw: KeywordHighlightConfig; index: number } | null = null;
    for (const kw of keywords) {
      const index = paragraph.indexOf(kw.text, pos);
      if (index !== -1 && (found === null || index < found.index)) {
        found = { kw, index };
      }
    }
    if (found === null) {
      parts.push({ type: "text", content: paragraph.slice(pos) });
      break;
    }
    if (found.index > pos) {
      parts.push({ type: "text", content: paragraph.slice(pos, found.index) });
    }
    parts.push({ type: "keyword", content: found.kw.text, config: found.kw });
    pos = found.index + found.kw.text.length;
  }

  return (
    <p className={cn("text-lg leading-relaxed break-words", className)}>
      {parts.map((part, i) => {
        if (part.type === "text") {
          return (
            <span key={i} className={textClassName}>
              {part.content}
            </span>
          );
        }
        const config = part.config!;
        return (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: (config.delay ?? 0) + i * 0.1,
              ease: [0.21, 0.47, 0.32, 0.98],
            }}
            className={cn(
              "inline border-b-2 border-dotted pb-0.5",
              config.colorClass
            )}
          >
            {part.content}
          </motion.span>
        );
      })}
    </p>
  );
}
