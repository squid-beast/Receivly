import { Link } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export function About() {
  return (
    <div className="flex min-h-screen min-w-0 flex-col overflow-x-hidden bg-background font-sans text-foreground antialiased">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <Container className="max-w-3xl">
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            About Receivly
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Receivly is built for small businesses that want to send invoices quickly,
            track who owes them money, and automate follow-ups without spreadsheets
            or complicated software.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            We focus on simplicity and clarity so you can spend less time on
            invoicing and more time growing your business.
          </p>
          <p className="mt-8">
            <Link
              to="/"
              className="inline-flex min-h-[44px] items-center text-sm font-medium text-primary-600 hover:text-primary-700 sm:min-h-0"
            >
              ← Back
            </Link>
          </p>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
