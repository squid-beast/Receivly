import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProtectedRoute } from "@/components/ProtectedRoute";
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
import { SignUpPage } from "@/pages/SignUpPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { OnboardingPage } from "@/pages/OnboardingPage";
import { CustomersPage } from "@/pages/CustomersPage";
import { InvoicesPage } from "@/pages/InvoicesPage";
import { NewInvoicePage } from "@/pages/NewInvoicePage";
import { SettingsPage } from "@/pages/SettingsPage";
import { HelpSupportPage } from "@/pages/HelpSupportPage";

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
  { path: "/signup", element: <SignUpPage /> },
  { path: "/onboarding", element: <OnboardingPage /> },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/customers",
    element: (
      <ProtectedRoute>
        <CustomersPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/invoices",
    element: (
      <ProtectedRoute>
        <InvoicesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/invoices/new",
    element: (
      <ProtectedRoute>
        <NewInvoicePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/help",
    element: (
      <ProtectedRoute>
        <HelpSupportPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/settings",
    element: (
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    ),
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider delayDuration={300}>
          <RouterProvider router={router} />
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
