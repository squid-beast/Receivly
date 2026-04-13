import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface InvoiceForPdf {
  invoiceNumber: string;
  issueDate?: string | null;
  dueDate: string;
  currency: string;
  subtotal: number;
  taxRate: number;
  discountAmount: number;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerAddress?: string | null;
  workspaceBusinessName?: string | null;
  workspaceAddress?: string | null;
  lineItems: InvoiceLineItem[];
}

function escapeHtml(s: string | null | undefined): string {
  if (!s) return "";
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function fmt(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

function buildInvoiceHtml(inv: InvoiceForPdf): string {
  const taxAmount = (inv.subtotal * inv.taxRate) / 100;

  const lineItemRows = inv.lineItems.length > 0
    ? inv.lineItems.map((item) => `
        <tr>
          <td style="padding:10px 8px;border-bottom:1px solid #f3f4f6;font-size:13px;color:#111827;">${escapeHtml(item.description)}</td>
          <td style="padding:10px 8px;border-bottom:1px solid #f3f4f6;font-size:13px;color:#374151;text-align:right;">${item.quantity}</td>
          <td style="padding:10px 8px;border-bottom:1px solid #f3f4f6;font-size:13px;color:#374151;text-align:right;">${fmt(item.unitPrice, inv.currency)}</td>
          <td style="padding:10px 8px;border-bottom:1px solid #f3f4f6;font-size:13px;font-weight:600;color:#111827;text-align:right;">${fmt(item.amount, inv.currency)}</td>
        </tr>`).join("")
    : `<tr><td colspan="4" style="padding:16px 8px;font-size:13px;color:#9ca3af;text-align:center;">No items</td></tr>`;

  return `
    <div style="width:794px;background:#ffffff;padding:56px 64px;box-sizing:border-box;font-family:Inter,Arial,sans-serif;color:#111827;">

      <!-- Header -->
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:48px;">
        <div>
          <div style="font-size:22px;font-weight:700;color:#059669;letter-spacing:-0.5px;">Receivly</div>
          <div style="font-size:13px;color:#6b7280;margin-top:2px;">Track What You're Owed</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:28px;font-weight:700;color:#111827;letter-spacing:-0.5px;">INVOICE</div>
          <div style="font-size:14px;color:#6b7280;margin-top:4px;">${escapeHtml(inv.invoiceNumber)}</div>
        </div>
      </div>

      <!-- From / Bill To -->
      <div style="display:flex;gap:48px;margin-bottom:40px;">
        <div style="flex:1;">
          <div style="font-size:11px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px;">From</div>
          <div style="font-size:14px;font-weight:600;color:#111827;">${escapeHtml(inv.workspaceBusinessName) || "Your Business"}</div>
          ${inv.workspaceAddress ? `<div style="font-size:13px;color:#6b7280;white-space:pre-wrap;margin-top:4px;">${escapeHtml(inv.workspaceAddress)}</div>` : ""}
        </div>
        <div style="flex:1;">
          <div style="font-size:11px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px;">Bill To</div>
          <div style="font-size:14px;font-weight:600;color:#111827;">${escapeHtml(inv.customerName)}</div>
          <div style="font-size:13px;color:#6b7280;margin-top:2px;">${escapeHtml(inv.customerEmail)}</div>
          ${inv.customerAddress ? `<div style="font-size:13px;color:#6b7280;white-space:pre-wrap;margin-top:2px;">${escapeHtml(inv.customerAddress)}</div>` : ""}
        </div>
        <div style="flex:1;text-align:right;">
          <div style="font-size:11px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px;">Dates</div>
          ${inv.issueDate ? `<div style="font-size:13px;color:#374151;margin-bottom:4px;"><span style="color:#9ca3af;">Issued:</span> ${escapeHtml(inv.issueDate)}</div>` : ""}
          <div style="font-size:13px;color:#374151;"><span style="color:#9ca3af;">Due:</span> ${escapeHtml(inv.dueDate)}</div>
        </div>
      </div>

      <!-- Line Items Table -->
      <table style="width:100%;border-collapse:collapse;margin-bottom:32px;">
        <thead>
          <tr style="background:#f9fafb;border-top:2px solid #e5e7eb;border-bottom:2px solid #e5e7eb;">
            <th style="padding:10px 8px;text-align:left;font-size:11px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Description</th>
            <th style="padding:10px 8px;text-align:right;font-size:11px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;width:60px;">Qty</th>
            <th style="padding:10px 8px;text-align:right;font-size:11px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;width:100px;">Unit Price</th>
            <th style="padding:10px 8px;text-align:right;font-size:11px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;width:100px;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${lineItemRows}
        </tbody>
      </table>

      <!-- Totals -->
      <div style="display:flex;justify-content:flex-end;margin-bottom:48px;">
        <div style="width:280px;">
          <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:13px;">
            <span style="color:#6b7280;">Subtotal</span>
            <span style="color:#374151;">${fmt(inv.subtotal, inv.currency)}</span>
          </div>
          ${inv.taxRate > 0 ? `<div style="display:flex;justify-content:space-between;padding:6px 0;font-size:13px;">
            <span style="color:#6b7280;">Tax (${inv.taxRate}%)</span>
            <span style="color:#374151;">${fmt(taxAmount, inv.currency)}</span>
          </div>` : ""}
          ${inv.discountAmount > 0 ? `<div style="display:flex;justify-content:space-between;padding:6px 0;font-size:13px;">
            <span style="color:#6b7280;">Discount</span>
            <span style="color:#ef4444;">-${fmt(inv.discountAmount, inv.currency)}</span>
          </div>` : ""}
          <div style="display:flex;justify-content:space-between;padding:12px 0 0;margin-top:8px;border-top:2px solid #e5e7eb;font-size:16px;font-weight:700;">
            <span style="color:#111827;">Total</span>
            <span style="color:#059669;">${fmt(inv.amount, inv.currency)}</span>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div style="border-top:1px solid #f3f4f6;padding-top:24px;text-align:center;">
        <p style="font-size:13px;color:#9ca3af;margin:0;">Thank you for your business!</p>
        <p style="font-size:11px;color:#d1d5db;margin:8px 0 0;">Generated by Receivly · getreceivly.com</p>
      </div>
    </div>
  `;
}

export async function generateInvoicePdf(inv: InvoiceForPdf): Promise<string> {
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.width = "794px";
  container.style.background = "#ffffff";
  container.innerHTML = buildInvoiceHtml(inv);
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.92);
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    if (imgHeight <= pageHeight) {
      pdf.addImage(imgData, "JPEG", 0, 0, pageWidth, imgHeight);
    } else {
      // Multi-page: slice image across pages
      let yOffset = 0;
      while (yOffset < canvas.height) {
        const sliceHeight = Math.min(
          canvas.height - yOffset,
          Math.floor((pageHeight * canvas.width) / pageWidth)
        );
        const sliceCanvas = document.createElement("canvas");
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = sliceHeight;
        const ctx = sliceCanvas.getContext("2d")!;
        ctx.drawImage(canvas, 0, -yOffset);
        const sliceData = sliceCanvas.toDataURL("image/jpeg", 0.92);
        const sliceRenderedHeight = (sliceHeight * pageWidth) / canvas.width;
        if (yOffset > 0) pdf.addPage();
        pdf.addImage(sliceData, "JPEG", 0, 0, pageWidth, sliceRenderedHeight);
        yOffset += sliceHeight;
      }
    }

    return pdf.output("datauristring").split(",")[1];
  } finally {
    document.body.removeChild(container);
  }
}
