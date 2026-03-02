import { Link } from "react-router-dom";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { FAQ } from "@/components/landing/FAQ";

export function FAQPage() {
  return (
    <div className="flex min-h-screen min-w-0 flex-col overflow-x-hidden bg-background font-sans text-foreground antialiased">
      <Navbar />
      <main className="flex-1">
        <FAQ />
        <div className="pb-16 text-center">
          <Link
            to="/"
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            ← Back
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
