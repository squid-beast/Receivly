import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import "./index.css";
import { LandingPage } from "@/pages/LandingPage";
import { TermsOfService } from "@/pages/TermsOfService";
import { PrivacyPolicy } from "@/pages/PrivacyPolicy";
import { About } from "@/pages/About";
import { Blog } from "@/pages/Blog";
import { Contact } from "@/pages/Contact";
import { Help } from "@/pages/Help";
import { FAQPage } from "@/pages/FAQPage";
import { SignInPage } from "@/pages/SignInPage";

// Prevent browser from restoring scroll on refresh so we can always show home from top
if (typeof window !== "undefined") {
  window.history.scrollRestoration = "manual";
}

const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/terms", element: <TermsOfService /> },
  { path: "/privacy", element: <PrivacyPolicy /> },
  { path: "/about", element: <About /> },
  { path: "/blog", element: <Blog /> },
  { path: "/contact", element: <Contact /> },
  { path: "/help", element: <Help /> },
  { path: "/faq", element: <FAQPage /> },
  { path: "/signin", element: <SignInPage /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
);
