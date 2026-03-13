import { useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export function Blog() {
  useEffect(() => {
    window.location.replace("https://blog.getreceivly.com");
  }, []);

  return (
    <div className="flex min-h-screen min-w-0 flex-col overflow-x-hidden bg-background font-sans text-foreground antialiased">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <Container className="max-w-3xl">
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Redirecting to the Receivly blog…
          </h1>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            If you&apos;re not redirected automatically,{" "}
            <a
              href="https://blog.getreceivly.com"
              className="text-primary-600 hover:text-primary-700"
            >
              click here to visit our blog.
            </a>
          </p>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
