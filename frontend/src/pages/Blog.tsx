import { Link } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export function Blog() {
  return (
    <div className="flex min-h-screen min-w-0 flex-col overflow-x-hidden bg-background font-sans text-foreground antialiased">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <Container className="max-w-3xl">
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Blog
          </h1>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            Updates, tips, and stories about invoicing and running a small business.
            Check back soon for new posts.
          </p>
          <p className="mt-8">
            <Link
              to="/"
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              ← Back to home
            </Link>
          </p>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
