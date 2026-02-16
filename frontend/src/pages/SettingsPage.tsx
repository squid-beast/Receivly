import { useState, useEffect } from "react";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

const CURRENCIES = [
  { code: "USD", label: "US Dollar" },
  { code: "EUR", label: "Euro" },
  { code: "GBP", label: "British Pound" },
  { code: "INR", label: "Indian Rupee" },
  { code: "CAD", label: "Canadian Dollar" },
  { code: "AUD", label: "Australian Dollar" },
];

const PAYMENT_TERMS = [
  { value: "NET_7", label: "Net 7" },
  { value: "NET_14", label: "Net 14" },
  { value: "NET_30", label: "Net 30" },
  { value: "NET_60", label: "Net 60" },
];

export function SettingsPage() {
  const { updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    businessName: "",
    currency: "USD",
    defaultPaymentTerms: "NET_30",
  });

  useEffect(() => {
    api.get("/workspaces/settings").then((res) => {
      setForm(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSaving(true);
    try {
      await api.put("/workspaces/settings", form);
      updateUser({ businessName: form.businessName });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || "Something went wrong.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const selectClass = cn(
    "flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm shadow-black/5",
    "focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/20"
  );

  if (loading) {
    return (
      <AppLayout>
        <div className="flex justify-center pt-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader
        title="Settings"
        description="Manage your workspace configuration."
      />

      <form
        onSubmit={handleSubmit}
        className="mt-6 max-w-lg space-y-6 rounded-lg border border-border bg-background p-6 shadow-sm"
      >
        <div className="space-y-2">
          <Label htmlFor="biz-name">Business Name</Label>
          <Input
            id="biz-name"
            value={form.businessName}
            onChange={(e) =>
              setForm((f) => ({ ...f, businessName: e.target.value }))
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">Default Currency</Label>
          <select
            id="currency"
            value={form.currency}
            onChange={(e) =>
              setForm((f) => ({ ...f, currency: e.target.value }))
            }
            className={selectClass}
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label} ({c.code})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="terms">Default Payment Terms</Label>
          <select
            id="terms"
            value={form.defaultPaymentTerms}
            onChange={(e) =>
              setForm((f) => ({ ...f, defaultPaymentTerms: e.target.value }))
            }
            className={selectClass}
          >
            {PAYMENT_TERMS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900/30 dark:bg-green-950/30 dark:text-green-400">
            Settings saved successfully.
          </div>
        )}

        <Button type="submit" disabled={saving}>
          {saving ? (
            <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-1.5 h-4 w-4" />
          )}
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </form>
    </AppLayout>
  );
}
