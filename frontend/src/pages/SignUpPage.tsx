import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.svg";

const KNOWN_ERRORS = new Set([
  "Registration failed. Please try again.",
  "Google sign-up failed. Please try again.",
  "Google sign-up was cancelled or failed.",
  "Too many requests. Please try again later.",
]);

function sanitizeError(err: unknown, fallback: string): string {
  const msg =
    (err as { response?: { data?: { error?: string } } })?.response?.data
      ?.error;
  if (msg && KNOWN_ERRORS.has(msg)) return msg;
  if (msg && msg.startsWith("password:")) return msg;
  return fallback;
}

function getPasswordStrength(pw: string): { label: string; color: string; width: string } {
  if (pw.length === 0) return { label: "", color: "", width: "0%" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;

  if (score <= 1) return { label: "Weak", color: "bg-red-500", width: "20%" };
  if (score <= 2) return { label: "Fair", color: "bg-orange-500", width: "40%" };
  if (score <= 3) return { label: "Good", color: "bg-yellow-500", width: "60%" };
  if (score <= 4) return { label: "Strong", color: "bg-green-500", width: "80%" };
  return { label: "Very Strong", color: "bg-emerald-500", width: "100%" };
}

export function SignUpPage() {
  const { signup, googleAuth } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    businessName: "",
    email: "",
    password: "",
  });

  const passwordStrength = getPasswordStrength(form.password);

  const passwordValid =
    form.password.length >= 8 &&
    /[a-z]/.test(form.password) &&
    /[A-Z]/.test(form.password) &&
    /\d/.test(form.password);

  const googleLogin = useGoogleLogin({
    flow: "implicit",
    onSuccess: async (tokenResponse) => {
      setError(null);
      setGoogleLoading(true);
      try {
        await googleAuth(tokenResponse.access_token);
        const storedUser = JSON.parse(
          localStorage.getItem("receivly-user") || "{}"
        );
        navigate(storedUser.onboardingCompleted ? "/dashboard" : "/onboarding");
      } catch (err: unknown) {
        setError(sanitizeError(err, "Google sign-up failed. Please try again."));
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => {
      setError("Google sign-up was cancelled or failed.");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordValid) {
      setError("Password must be at least 8 characters with uppercase, lowercase, and a digit.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await signup(form);
      navigate("/onboarding");
    } catch (err: unknown) {
      setError(sanitizeError(err, "Something went wrong. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left panel - branding */}
      <div className="hidden w-1/2 flex-col justify-between bg-foreground p-12 lg:flex">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold font-display text-background">
          <img src={logo} alt="Receivly" className="h-7 w-7 shrink-0 object-contain invert" />
          Receivly
        </Link>
        <div>
          <blockquote className="text-lg leading-relaxed text-background/80">
            &ldquo;Receivly cut our invoicing time from hours to minutes. We
            finally get paid on time.&rdquo;
          </blockquote>
          <p className="mt-4 text-sm font-medium text-background/60">
            - Anonymous
          </p>
        </div>
        <p className="text-xs text-background/40">
          &copy; {new Date().getFullYear()} Receivly
        </p>
      </div>

      {/* Right panel - form */}
      <div className="flex flex-1 items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] as const }}
          className="w-full max-w-md"
        >
          <Link
            to="/"
            className="mb-8 flex items-center gap-2 text-lg font-bold font-display text-foreground lg:hidden"
          >
            <img
              src={logo}
              alt="Receivly"
              className="h-7 w-7 shrink-0 object-contain"
            />
            Receivly
          </Link>

          <div className="rounded-2xl border border-border bg-card px-8 py-9 shadow-sm">
            <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Use your Google account or fill in the details below.
            </p>

            <Button
              type="button"
              variant="outline"
              disabled={googleLoading}
              onClick={() => googleLogin()}
              className="mt-6 flex w-full items-center justify-center gap-2 border-muted bg-background text-sm font-medium"
            >
              {googleLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              <span>{googleLoading ? "Signing up\u2026" : "Sign up with Google"}</span>
            </Button>

            <div className="mt-6 flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                OR
              </span>
              <Separator className="flex-1" />
            </div>

            {error && (
              <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input
                  id="fullName"
                  placeholder="Jane Smith"
                  autoComplete="name"
                  maxLength={100}
                  value={form.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessName">Business name</Label>
                <Input
                  id="businessName"
                  placeholder="Acme Inc."
                  autoComplete="organization"
                  maxLength={200}
                  value={form.businessName}
                  onChange={(e) => updateField("businessName", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  maxLength={255}
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                    value={form.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    required
                    minLength={8}
                    maxLength={128}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {form.password.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all", passwordStrength.color)}
                        style={{ width: passwordStrength.width }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {passwordStrength.label}
                      {!passwordValid && " — needs uppercase, lowercase & digit"}
                    </p>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading || !passwordValid}
                className={cn("w-full", (loading || !passwordValid) && "opacity-70")}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRight className="mr-2 h-4 w-4" />
                )}
                {loading ? "Creating account\u2026" : "Create account"}
              </Button>
            </form>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              By signing up you agree to our{" "}
              <Link
                to="/terms"
                className="underline underline-offset-4 hover:text-foreground"
              >
                Terms
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="underline underline-offset-4 hover:text-foreground"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="font-medium text-primary-600 hover:text-primary-700"
            >
              Login
            </Link>
            .
          </p>
        </motion.div>
      </div>
    </div>
  );
}
