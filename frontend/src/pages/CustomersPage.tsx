import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Users,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { DetailDrawer } from "@/components/ui/DetailDrawer";
import { EmptyState } from "@/components/ui/EmptyState";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

interface Customer {
  id: string;
  name: string;
  email: string;
  paymentTerms: string;
  createdAt: string;
}

const PAYMENT_TERMS_OPTIONS = [
  { value: "NET_7", label: "Net 7" },
  { value: "NET_14", label: "Net 14" },
  { value: "NET_30", label: "Net 30" },
  { value: "NET_60", label: "Net 60" },
];

const emptyForm = { name: "", email: "", paymentTerms: "NET_30" };

export function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const fetchCustomers = useCallback(async () => {
    try {
      const res = await api.get("/customers");
      setCustomers(res.data);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
    setModalOpen(true);
  };

  const openEdit = (c: Customer) => {
    setEditingId(c.id);
    setForm({ name: c.name, email: c.email, paymentTerms: c.paymentTerms });
    setError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/customers/${editingId}`, form);
      } else {
        await api.post("/customers", form);
      }
      setModalOpen(false);
      await fetchCustomers();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || "Something went wrong.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/customers/${id}`);
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      if (selectedCustomer?.id === id) setSelectedCustomer(null);
    } catch {
      /* ignore */
    }
  };

  const filteredCustomers = customers.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
  });

  const selectClass = cn(
    "flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm shadow-black/5",
    "focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/20"
  );

  const getTermsLabel = (val: string) =>
    PAYMENT_TERMS_OPTIONS.find((t) => t.value === val)?.label || val;

  return (
    <AppLayout>
      <PageHeader title="Customers" description="Manage your clients and their payment terms.">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-48 pl-9 sm:w-64"
          />
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-1.5 h-4 w-4" />
          Add Customer
        </Button>
      </PageHeader>

      {loading ? (
        <div className="mt-12 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : customers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No customers yet"
          description="Add your first customer to start invoicing."
          className="mt-8"
        >
          <Button onClick={openCreate}>
            <Plus className="mr-1.5 h-4 w-4" />
            Add Customer
          </Button>
        </EmptyState>
      ) : (
        <div className="mt-6">
          <DataTable
            columns={[
              {
                key: "name",
                header: "Name",
                render: (c: Customer) => (
                  <div>
                    <p className="font-medium text-foreground">{c.name}</p>
                    <p className="text-xs text-muted-foreground sm:hidden">{c.email}</p>
                  </div>
                ),
              },
              {
                key: "email",
                header: "Email",
                className: "hidden sm:table-cell",
                headerClassName: "hidden sm:table-cell",
                render: (c: Customer) => (
                  <span className="text-muted-foreground">{c.email}</span>
                ),
              },
              {
                key: "terms",
                header: "Payment Terms",
                className: "hidden md:table-cell",
                headerClassName: "hidden md:table-cell",
                render: (c: Customer) => (
                  <span className="inline-flex rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground">
                    {getTermsLabel(c.paymentTerms)}
                  </span>
                ),
              },
              {
                key: "actions",
                header: "",
                className: "text-right",
                headerClassName: "text-right",
                render: (c: Customer) => (
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => { e.stopPropagation(); openEdit(c); }}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={(e) => { e.stopPropagation(); handleDelete(c.id); }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ),
              },
            ]}
            data={filteredCustomers}
            keyExtractor={(c) => c.id}
            onRowClick={(c) => setSelectedCustomer(c)}
          />
        </div>
      )}

      {/* Customer Detail Drawer */}
      <DetailDrawer
        open={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        title={selectedCustomer?.name || ""}
        subtitle={selectedCustomer?.email}
      >
        {selectedCustomer && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Email</span>
                <span className="text-sm text-foreground">{selectedCustomer.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Payment Terms</span>
                <span className="inline-flex rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground">
                  {getTermsLabel(selectedCustomer.paymentTerms)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Added</span>
                <span className="text-sm text-foreground">
                  {new Date(selectedCustomer.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex gap-3 border-t border-border pt-4">
              <Button variant="outline" className="flex-1" onClick={() => { openEdit(selectedCustomer); setSelectedCustomer(null); }}>
                <Pencil className="mr-1.5 h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                className="flex-1 text-destructive hover:text-destructive"
                onClick={() => { handleDelete(selectedCustomer.id); }}
              >
                <Trash2 className="mr-1.5 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        )}
      </DetailDrawer>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              onClick={() => setModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: [0.21, 0.47, 0.32, 0.98] as const }}
              className="fixed inset-x-4 top-[10%] z-50 mx-auto max-w-md rounded-lg border border-border bg-background p-6 shadow-xl sm:inset-x-auto"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">
                  {editingId ? "Edit Customer" : "Add Customer"}
                </h2>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setModalOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {error && (
                <div className="mt-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cust-name">Name</Label>
                  <Input
                    id="cust-name"
                    placeholder="Acme Inc."
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cust-email">Email</Label>
                  <Input
                    id="cust-email"
                    type="email"
                    placeholder="billing@acme.com"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cust-terms">Payment Terms</Label>
                  <select
                    id="cust-terms"
                    value={form.paymentTerms}
                    onChange={(e) => setForm((f) => ({ ...f, paymentTerms: e.target.value }))}
                    className={selectClass}
                  >
                    {PAYMENT_TERMS_OPTIONS.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
                    {editingId ? "Save Changes" : "Add Customer"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
