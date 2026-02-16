# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Receivly is a full-stack invoicing SaaS for small businesses. Java Spring Boot backend + React TypeScript frontend, organized as a monorepo with `backend/` and `frontend/` directories.

## Tech Stack

- **Backend**: Spring Boot 3.5.10, Java 17, Maven, PostgreSQL, Spring Data JPA (Hibernate), Spring Security, Lombok
- **Frontend**: React 19, TypeScript 5.9, Vite 8, Tailwind CSS 3, Framer Motion, Lucide React icons, class-variance-authority (CVA), clsx + tailwind-merge via `cn()` utility

## Common Commands

### Backend (from `backend/`)

```bash
./mvnw spring-boot:run          # Start dev server (default port 8080)
./mvnw clean install             # Build and run tests
./mvnw test                      # Run all tests
./mvnw test -Dtest=ClassName     # Run a single test class
./mvnw test -Dtest=ClassName#methodName  # Run a single test method
```

### Frontend (from `frontend/`)

```bash
npm install                      # Install dependencies
npm run dev                      # Start Vite dev server
npm run build                    # TypeScript check + production build (tsc -b && vite build)
npm run lint                     # ESLint check
npm run preview                  # Preview production build locally
```

## Frontend Architecture

### Design System (shadcn/ui pattern)

- **`src/lib/utils.ts`** — `cn()` utility (clsx + tailwind-merge) used everywhere for class merging
- **CSS variables** — HSL-based design tokens in `src/index.css` (`:root` block) for colors: `--primary`, `--background`, `--foreground`, `--border`, `--muted`, etc.
- **`tailwind.config.js`** — maps CSS variables to Tailwind classes (`bg-background`, `text-foreground`, `border-border`, etc.)
- **Path alias** — `@/` maps to `src/` (configured in both `vite.config.ts` and `tsconfig.app.json`)

### Component Structure

```
src/
├── lib/utils.ts                    # cn() utility
├── components/
│   ├── ui/                         # Reusable design system primitives
│   │   ├── Button.tsx              # CVA variants: default, secondary, outline, ghost, link
│   │   ├── Badge.tsx               # CVA variants: default, success, warning, destructive, outline
│   │   ├── Card.tsx                # Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
│   │   ├── Container.tsx           # Max-width responsive wrapper
│   │   ├── AnimatedSection.tsx     # Scroll-triggered fade-up (framer-motion whileInView)
│   │   └── SectionHeading.tsx      # Reusable section header (badge + title + description)
│   └── landing/                    # Landing page sections
│       ├── Navbar.tsx              # Glassmorphism sticky nav + mobile drawer (AnimatePresence)
│       ├── Hero.tsx                # Gradient orbs, staggered motion entrance, beta badge
│       ├── ProductPreview.tsx      # Fake browser chrome + dashboard mock with sidebar
│       ├── TrustStrip.tsx          # Trust signals strip
│       ├── Problem.tsx             # Pain point section
│       ├── HowItWorks.tsx          # 3-step cards on dark bg
│       ├── Features.tsx            # 6-feature grid with icon color-swap hover
│       ├── Security.tsx            # Dark section with security points
│       ├── CTA.tsx                 # Gradient bg + grid pattern overlay
│       ├── Testimonials.tsx        # 3-column masonry with star ratings
│       ├── Pricing.tsx             # 3-tier with dark featured card
│       ├── FAQ.tsx                 # Animated accordion (AnimatePresence)
│       └── Footer.tsx              # Logo + links
└── App.tsx                         # Composes all landing sections
```

### Key Patterns

- **All icons** use `lucide-react` — never raw SVGs in components
- **All animations** use `framer-motion` — `whileInView` with `viewport={{ once: true }}` for scroll reveals, `AnimatePresence` for enter/exit
- **Framer Motion ease tuples** must use `as const` assertion (e.g., `ease: [0.21, 0.47, 0.32, 0.98] as const`) to satisfy TypeScript
- **Button variants** via `class-variance-authority` with `cn()` for className merging
- **Section backgrounds** alternate: white → border-strip → white → gray-950 → white → gray-950 → gradient → muted → white → white
- **Dark sections** use `dark` prop on `SectionHeading` and `border-white/[0.06]` glass-style cards
- **Mobile responsive** — all grids collapse to single column, nav becomes hamburger with animated drawer

### Backend (`backend/`)

Spring Boot application with standard layered architecture. Package root: `com.receivly.receivly_backend`.

- Entry point: `ReceivlyBackendApplication.java`
- Config: `src/main/resources/application.properties`
- Uses Lombok — ensure annotation processing is enabled in your IDE
- Maven wrapper (`mvnw`) included — no global Maven install needed

### Backend–Frontend Integration

The frontend communicates with the backend via REST API using Axios. No CORS or proxy configuration exists yet — this will need to be set up when connecting the two.
