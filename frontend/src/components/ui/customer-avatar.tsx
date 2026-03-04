import { cn } from "@/lib/utils";

const PALETTE = [
  { bg: "#FEE2E2", fg: "#DC2626" },   // red
  { bg: "#DBEAFE", fg: "#2563EB" },   // blue
  { bg: "#D1FAE5", fg: "#059669" },   // green
  { bg: "#FDE68A", fg: "#B45309" },   // amber
  { bg: "#E0E7FF", fg: "#4F46E5" },   // indigo
  { bg: "#FCE7F3", fg: "#DB2777" },   // pink
  { bg: "#CCFBF1", fg: "#0D9488" },   // teal
  { bg: "#FED7AA", fg: "#EA580C" },   // orange
  { bg: "#DDD6FE", fg: "#7C3AED" },   // violet
  { bg: "#CFFAFE", fg: "#0891B2" },   // cyan
  { bg: "#F3E8FF", fg: "#9333EA" },   // purple
  { bg: "#FEF3C7", fg: "#D97706" },   // yellow
];

const SKIN_TONES = ["#FFDBB4", "#EDB98A", "#D08B5B", "#AE5D29", "#614335"];
const HAIR_COLORS = ["#2C1B18", "#4A312C", "#6B4226", "#8B6914", "#1C1C1C", "#A0522D"];

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0;
  }
  return Math.abs(hash);
}

function pick<T>(arr: T[], hash: number, offset = 0): T {
  return arr[(hash + offset) % arr.length];
}

interface CustomerAvatarProps {
  name: string;
  size?: number;
  className?: string;
}

export function CustomerAvatar({ name, size = 40, className }: CustomerAvatarProps) {
  const h = hashCode(name);
  const color = pick(PALETTE, h);
  const skin = pick(SKIN_TONES, h, 3);
  const hair = pick(HAIR_COLORS, h, 7);
  const isLongHair = h % 2 === 0;
  const hasGlasses = h % 5 === 0;
  const smileWidth = 3 + (h % 3);

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full",
        className
      )}
      style={{ width: size, height: size, backgroundColor: color.bg }}
    >
      <svg
        viewBox="0 0 40 40"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Head */}
        <circle cx="20" cy="18" r="9" fill={skin} />

        {/* Hair */}
        {isLongHair ? (
          <>
            <ellipse cx="20" cy="13" rx="9.5" ry="6" fill={hair} />
            <rect x="10.5" y="13" width="3" height="9" rx="1.5" fill={hair} />
            <rect x="26.5" y="13" width="3" height="9" rx="1.5" fill={hair} />
          </>
        ) : (
          <>
            <ellipse cx="20" cy="13" rx="9.5" ry="5.5" fill={hair} />
            <rect x="11" y="10" width="18" height="4" rx="2" fill={hair} />
          </>
        )}

        {/* Eyes */}
        <circle cx="16.5" cy="18" r="1.4" fill="#1a1a1a" />
        <circle cx="23.5" cy="18" r="1.4" fill="#1a1a1a" />
        <circle cx="17" cy="17.5" r="0.5" fill="#fff" />
        <circle cx="24" cy="17.5" r="0.5" fill="#fff" />

        {/* Glasses */}
        {hasGlasses && (
          <>
            <circle cx="16.5" cy="18" r="3" stroke="#333" strokeWidth="0.7" fill="none" />
            <circle cx="23.5" cy="18" r="3" stroke="#333" strokeWidth="0.7" fill="none" />
            <line x1="19.5" y1="18" x2="20.5" y2="18" stroke="#333" strokeWidth="0.7" />
          </>
        )}

        {/* Smile */}
        <path
          d={`M${20 - smileWidth / 2},22 Q20,24.5 ${20 + smileWidth / 2},22`}
          stroke="#1a1a1a"
          strokeWidth="0.8"
          strokeLinecap="round"
          fill="none"
        />

        {/* Body / shoulders */}
        <ellipse cx="20" cy="36" rx="12" ry="8" fill={color.fg} opacity="0.85" />
      </svg>
    </div>
  );
}

export function getAvatarColor(name: string) {
  return pick(PALETTE, hashCode(name));
}
