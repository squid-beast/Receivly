import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Loader2, Send, FileText } from "lucide-react";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

interface Customer {
  id: string;
  name: string;
  email: string;
  address?: string | null;
}

interface WorkspaceSettings {
  businessName: string;
  address?: string;
  currency: string;
}

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: string;
}

const defaultLineItem = (): LineItem => ({
  id: crypto.randomUUID(),
  description: "",
  quantity: 1,
  unitPrice: "",
});

export function NewInvoicePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const preselectedCustomerId = (location.state as { customerId?: string } | null)?.customerId;
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [workspace, setWorkspace] = useState<WorkspaceSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoPreview, setAutoPreview] = useState(true);

  const [customerId, setCustomerId] = useState("");
  const [issueDate, setIssueDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [billingAddress, setBillingAddress] = useState("");
  const [lineItems, setLineItems] = useState<LineItem[]>([defaultLineItem()]);
  const [taxRate, setTaxRate] = useState(5);
  const [discountAmount, setDiscountAmount] = useState(0);

  useEffect(() => {
    Promise.all([
      api.get("/customers"),
      api.get("/workspaces/settings"),
    ])
      .then(([custRes, wsRes]) => {
        const list = custRes.data ?? [];
        setCustomers(list);
        setWorkspace(wsRes.data);
        const toSelect = preselectedCustomerId && list.some((c: Customer) => c.id === preselectedCustomerId)
          ? preselectedCustomerId
          : list[0]?.id ?? "";
        if (toSelect) {
          setCustomerId(toSelect);
          const c = list.find((x: Customer) => x.id === toSelect);
          if (c) setBillingAddress(c.address ?? "");
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!customerId) return;
    const c = customers.find((x) => x.id === customerId);
    if (c) setBillingAddress(c.address ?? "");
  }, [customerId, customers]);

  const addItem = () =>
    setLineItems((prev) => [...prev, defaultLineItem()]);
  const removeItem = (id: string) =>
    setLineItems((prev) => (prev.length > 1 ? prev.filter((i) => i.id !== id) : prev));
  const updateItem = (id: string, field: keyof LineItem, value: string | number) =>
    setLineItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );

  const validItems = useMemo(
    () =>
      lineItems.filter(
        (i) =>
          i.description.trim() !== "" &&
          i.quantity >= 1 &&
          parseFloat(String(i.unitPrice)) >= 0
      ),
    [lineItems]
  );

  const subtotal = useMemo(() => {
    return validItems.reduce(
      (sum, i) =>
        sum + i.quantity * (parseFloat(String(i.unitPrice)) || 0),
      0
    );
  }, [validItems]);

  const taxAmount = (subtotal * taxRate) / 100;
  const total = Math.max(0, subtotal + taxAmount - discountAmount);

  const currency = workspace?.currency ?? "USD";
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
      amount
    );

  const payload = useMemo(() => {
    return {
      customerId,
      issueDate,
      lineItems: validItems.map((i) => ({
        description: i.description.trim(),
        quantity: i.quantity,
        unitPrice: parseFloat(String(i.unitPrice)) || 0,
      })),
      taxRate: Number(taxRate) || 0,
      discountAmount: Number(discountAmount) || 0,
    };
  }, [customerId, issueDate, validItems, taxRate, discountAmount]);

  const canSave =
    customerId &&
    validItems.length > 0 &&
    validItems.every(
      (i) =>
        i.description.trim() !== "" &&
        i.quantity >= 1 &&
        parseFloat(String(i.unitPrice)) >= 0
    );

  const saveDraft = async () => {
    if (!canSave) return;
    setError(null);
    setSaving(true);
    try {
      await api.post("/invoices", { ...payload, draft: true });
      navigate("/dashboard/invoices");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || "Failed to save draft.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const sendInvoice = async () => {
    if (!canSave) return;
    setError(null);
    setSending(true);
    try {
      await api.post("/invoices", { ...payload, draft: false });
      navigate("/dashboard/invoices");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || "Failed to send invoice.";
      setError(msg);
    } finally {
      setSending(false);
    }
  };

  const selectedCustomer = customers.find((c) => c.id === customerId);
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
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            New Invoice
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <input
                type="checkbox"
                checked={autoPreview}
                onChange={(e) => setAutoPreview(e.target.checked)}
                className="h-4 w-4 rounded border-input accent-primary"
              />
              Auto Preview
            </label>
            <Button
              type="button"
              variant="outline"
              onClick={saveDraft}
              disabled={!canSave || saving || sending}
            >
              {saving ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : (
                <FileText className="mr-1.5 h-4 w-4" />
              )}
              Save Draft
            </Button>
            <Button
              type="button"
              onClick={sendInvoice}
              disabled={!canSave || saving || sending}
            >
              {sending ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-1.5 h-4 w-4" />
              )}
              Send Invoice
            </Button>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Left: Form */}
          <div className="space-y-8 rounded-xl border border-border bg-background p-6 shadow-sm">
            <section>
              <h2 className="mb-5 font-display text-lg font-semibold text-foreground">
                Invoice details
              </h2>
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label>Bill to</Label>
                  <select
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    className={selectClass}
                  >
                    <option value="">Select customer</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} — {c.email}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Invoice number</Label>
                    <Input
                      value="Auto-generated on save"
                      readOnly
                      className="bg-muted/50 text-muted-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={issueDate}
                      onChange={(e) => setIssueDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <textarea
                    rows={3}
                    value={billingAddress}
                    onChange={(e) => setBillingAddress(e.target.value)}
                    placeholder="Billing address"
                    className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm shadow-black/5 placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/20"
                  />
                </div>
              </div>
            </section>

            <section>
              <h2 className="mb-5 font-display text-lg font-semibold text-foreground">
                Invoice items
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="pb-2 pr-2 font-medium text-muted-foreground">
                        Description
                      </th>
                      <th className="w-20 pb-2 pr-2 font-medium text-muted-foreground">
                        QTY
                      </th>
                      <th className="w-28 pb-2 pr-2 font-medium text-muted-foreground">
                        Price
                      </th>
                      <th className="w-24 pb-2 text-right font-medium text-muted-foreground">
                        Total
                      </th>
                      <th className="w-10 pb-2" />
                    </tr>
                  </thead>
                  <tbody>
                    {lineItems.map((item) => (
                      <tr key={item.id} className="border-b border-border/60">
                        <td className="py-2 pr-2">
                          <Input
                            placeholder="e.g. Web hosting"
                            value={item.description}
                            onChange={(e) =>
                              updateItem(item.id, "description", e.target.value)
                            }
                            className="h-9"
                          />
                        </td>
                        <td className="py-2 pr-2">
                          <Input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) =>
                              updateItem(
                                item.id,
                                "quantity",
                                parseInt(e.target.value, 10) || 1
                              )
                            }
                            className="h-9"
                          />
                        </td>
                        <td className="py-2 pr-2">
                          <Input
                            type="number"
                            min={0}
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) =>
                              updateItem(item.id, "unitPrice", e.target.value)
                            }
                            className="h-9"
                          />
                        </td>
                        <td className="py-2 text-right font-medium text-foreground">
                          {formatCurrency(
                            item.quantity * (parseFloat(String(item.unitPrice)) || 0)
                          )}
                        </td>
                        <td className="py-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={addItem}
              >
                <Plus className="mr-1.5 h-4 w-4" />
                Add item
              </Button>

              <div className="mt-8 space-y-3 border-t border-border pt-5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sub total</span>
                  <span className="font-medium text-foreground">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Tax (%)</span>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    step="0.5"
                    value={taxRate}
                    onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                    className="h-9 w-24"
                  />
                  <span className="text-sm font-medium text-foreground ml-auto">
                    {formatCurrency(taxAmount)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Discount</span>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    value={discountAmount}
                    onChange={(e) =>
                      setDiscountAmount(parseFloat(e.target.value) || 0)
                    }
                    className="h-9 w-24"
                  />
                  <span className="text-sm font-medium text-foreground ml-auto">
                    {formatCurrency(discountAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-semibold text-foreground">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </section>
          </div>

          {/* Right: Preview */}
          {autoPreview && (
            <div className="rounded-xl border border-border bg-background p-6 shadow-sm lg:sticky lg:top-8 lg:self-start">
              <h2 className="mb-5 font-display text-lg font-semibold text-foreground">
                Invoice preview
              </h2>
              <div className="space-y-5 text-sm">
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Invoice</span>
                  <span className="font-medium text-foreground">
                    INV-... — {issueDate}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-6 border-b border-border pb-5">
                  <div>
                    <p className="font-medium text-foreground">
                      {workspace?.businessName ?? "Your business"}
                    </p>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {workspace?.address || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Bill to</p>
                    <p className="text-foreground">
                      {selectedCustomer?.name ?? "—"}
                    </p>
                    <p className="text-muted-foreground">
                      {selectedCustomer?.email ?? "—"}
                    </p>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {billingAddress || "—"}
                    </p>
                  </div>
                </div>
                <div className="border-b border-border pb-2">
                  <span className="text-muted-foreground">Due date</span>
                  <span className="ml-2 text-foreground">
                    {issueDate} (based on payment terms)
                  </span>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="pb-2 font-medium text-muted-foreground">
                        Description
                      </th>
                      <th className="w-14 pb-2 text-right font-medium text-muted-foreground">
                        QTY
                      </th>
                      <th className="w-20 pb-2 text-right font-medium text-muted-foreground">
                        Unit
                      </th>
                      <th className="w-24 pb-2 text-right font-medium text-muted-foreground">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {validItems.map((item, idx) => (
                      <tr key={idx} className="border-b border-border/60">
                        <td className="py-2 text-foreground">
                          {item.description}
                        </td>
                        <td className="py-2 text-right text-foreground">
                          {item.quantity}
                        </td>
                        <td className="py-2 text-right text-foreground">
                          {formatCurrency(parseFloat(String(item.unitPrice)) || 0)}
                        </td>
                        <td className="py-2 text-right font-medium text-foreground">
                          {formatCurrency(
                            item.quantity * (parseFloat(String(item.unitPrice)) || 0)
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="space-y-2 border-t border-border pt-5">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Tax ({taxRate}%)
                    </span>
                    <span className="text-foreground">
                      {formatCurrency(taxAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="text-foreground">
                      {formatCurrency(discountAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold text-foreground">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
