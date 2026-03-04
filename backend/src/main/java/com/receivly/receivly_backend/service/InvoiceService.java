package com.receivly.receivly_backend.service;

import com.receivly.receivly_backend.dto.InvoiceLineItemRequest;
import com.receivly.receivly_backend.dto.InvoiceRequest;
import com.receivly.receivly_backend.dto.InvoiceResponse;
import com.receivly.receivly_backend.dto.InvoiceUpdateRequest;
import com.receivly.receivly_backend.entity.Customer;
import com.receivly.receivly_backend.entity.Invoice;
import com.receivly.receivly_backend.entity.InvoiceLineItem;
import com.receivly.receivly_backend.entity.Payment;
import com.receivly.receivly_backend.entity.Workspace;
import com.receivly.receivly_backend.repository.CustomerRepository;
import com.receivly.receivly_backend.repository.InvoiceRepository;
import com.receivly.receivly_backend.repository.PaymentRepository;
import com.receivly.receivly_backend.repository.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDate;
import java.time.Year;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final CustomerRepository customerRepository;
    private final WorkspaceRepository workspaceRepository;
    private final PaymentRepository paymentRepository;

    @Transactional(readOnly = true)
    public List<InvoiceResponse> list(UUID workspaceId) {
        return invoiceRepository.findByWorkspaceIdOrderByCreatedAtDesc(workspaceId)
                .stream()
                .map(InvoiceResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public InvoiceResponse getById(UUID workspaceId, UUID invoiceId) {
        Invoice inv = invoiceRepository.findByIdAndWorkspaceId(invoiceId, workspaceId)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found"));
        return InvoiceResponse.from(inv);
    }

    @Transactional
    public InvoiceResponse create(UUID workspaceId, InvoiceRequest request) {
        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new IllegalArgumentException("Workspace not found"));

        Customer customer = customerRepository.findByIdAndWorkspaceId(request.getCustomerId(), workspaceId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        int year = Year.now().getValue();
        String clientCode = deriveClientCode(customer.getName());
        int nextNum = invoiceRepository.findMaxInvoiceNumber(workspaceId) + 1;
        String invoiceNumber = String.format("INV-%d-%s-%05d", year, clientCode, nextNum);

        int daysToAdd = switch (customer.getPaymentTerms()) {
            case "NET_7" -> 7;
            case "NET_14" -> 14;
            case "NET_60" -> 60;
            default -> 30;
        };

        LocalDate issueDate = request.getIssueDate() != null ? request.getIssueDate() : LocalDate.now();
        BigDecimal taxRate = request.getTaxRate() != null ? request.getTaxRate() : BigDecimal.ZERO;
        BigDecimal discountAmount = request.getDiscountAmount() != null ? request.getDiscountAmount() : BigDecimal.ZERO;

        BigDecimal subtotal;
        String description;
        List<InvoiceLineItem> lineItemEntities = new ArrayList<>();

        if (request.getLineItems() != null && !request.getLineItems().isEmpty()) {
            subtotal = BigDecimal.ZERO;
            StringBuilder descBuilder = new StringBuilder();
            for (InvoiceLineItemRequest req : request.getLineItems()) {
                int qty = req.getQuantity() != null ? req.getQuantity() : 1;
                BigDecimal unitPrice = req.getUnitPrice() != null ? req.getUnitPrice() : BigDecimal.ZERO;
                BigDecimal lineAmount = unitPrice.multiply(BigDecimal.valueOf(qty)).setScale(2, RoundingMode.HALF_UP);
                subtotal = subtotal.add(lineAmount);
                if (descBuilder.length() > 0) descBuilder.append(", ");
                descBuilder.append(req.getDescription());
                lineItemEntities.add(InvoiceLineItem.builder()
                        .description(req.getDescription())
                        .quantity(qty)
                        .unitPrice(unitPrice)
                        .amount(lineAmount)
                        .build());
            }
            description = descBuilder.length() > 500 ? descBuilder.substring(0, 497) + "…" : descBuilder.toString();
        } else {
            if (request.getDescription() == null || request.getAmount() == null) {
                throw new IllegalArgumentException("Description and amount are required when no line items provided");
            }
            description = request.getDescription();
            subtotal = request.getAmount();
            lineItemEntities.add(InvoiceLineItem.builder()
                    .description(request.getDescription())
                    .quantity(1)
                    .unitPrice(request.getAmount())
                    .amount(request.getAmount())
                    .build());
        }

        BigDecimal total = subtotal
                .add(subtotal.multiply(taxRate).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP))
                .subtract(discountAmount)
                .setScale(2, RoundingMode.HALF_UP);
        if (total.compareTo(BigDecimal.ZERO) < 0) {
            total = BigDecimal.ZERO;
        }

        boolean asDraft = Boolean.TRUE.equals(request.getDraft());
        Invoice invoice = Invoice.builder()
                .workspace(workspace)
                .customer(customer)
                .invoiceNumber(invoiceNumber)
                .description(description)
                .amount(total)
                .subtotal(subtotal)
                .taxRate(taxRate)
                .discountAmount(discountAmount)
                .currency(workspace.getCurrency())
                .status(asDraft ? Invoice.Status.DRAFT : Invoice.Status.SENT)
                .issueDate(issueDate)
                .dueDate(issueDate.plusDays(daysToAdd))
                .build();
        invoice = invoiceRepository.save(invoice);
        for (InvoiceLineItem item : lineItemEntities) {
            item.setInvoice(invoice);
            invoice.getLineItems().add(item);
        }
        invoiceRepository.save(invoice);
        return InvoiceResponse.from(invoice);
    }

    private String deriveClientCode(String customerName) {
        if (customerName == null) {
            return "CLIENT";
        }
        String normalized = customerName
                .toUpperCase()
                .replaceAll("[^A-Z0-9]", "");
        if (normalized.isEmpty()) {
            return "CLIENT";
        }
        return normalized.length() > 8 ? normalized.substring(0, 8) : normalized;
    }

    @Transactional
    public InvoiceResponse markAsPaid(UUID workspaceId, UUID invoiceId) {
        Invoice invoice = invoiceRepository.findByIdAndWorkspaceId(invoiceId, workspaceId)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found"));
        if (invoice.getStatus() == Invoice.Status.PAID) {
            throw new IllegalArgumentException("Invoice is already paid");
        }
        invoice.setStatus(Invoice.Status.PAID);
        invoice.setPaidAt(Instant.now());
        invoice = invoiceRepository.save(invoice);

        Payment payment = Payment.builder()
                .invoice(invoice)
                .amount(invoice.getAmount())
                .currency(invoice.getCurrency())
                .note("Marked as paid")
                .build();
        paymentRepository.save(payment);

        return InvoiceResponse.from(invoice);
    }

    @Transactional
    public InvoiceResponse update(UUID workspaceId, UUID invoiceId, InvoiceUpdateRequest request) {
        Invoice invoice = invoiceRepository.findByIdAndWorkspaceId(invoiceId, workspaceId)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found"));
        if (invoice.getStatus() == Invoice.Status.PAID) {
            throw new IllegalArgumentException("Cannot edit a paid invoice");
        }
        invoice.setDescription(request.getDescription());
        invoice.setAmount(request.getAmount());
        invoice.setDueDate(request.getDueDate());
        invoice = invoiceRepository.save(invoice);
        return InvoiceResponse.from(invoice);
    }

    @Transactional
    public void delete(UUID workspaceId, UUID invoiceId) {
        Invoice invoice = invoiceRepository.findByIdAndWorkspaceId(invoiceId, workspaceId)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found"));
        if (invoice.getStatus() == Invoice.Status.PAID) {
            throw new IllegalArgumentException("Cannot delete a paid invoice");
        }
        invoiceRepository.delete(invoice);
    }

    /**
     * Email send stub: log that invoice was "sent" to customer and set sentAt.
     * Real email integration can be added later.
     */
    @Transactional
    public InvoiceResponse sendToClient(UUID workspaceId, UUID invoiceId) {
        Invoice invoice = invoiceRepository.findByIdAndWorkspaceId(invoiceId, workspaceId)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found"));
        if (invoice.getStatus() == Invoice.Status.PAID) {
            throw new IllegalArgumentException("Cannot send a paid invoice");
        }
        String to = invoice.getCustomer().getEmail();
        log.info("SEND INVOICE (stub): Invoice {} sent to client {}", invoice.getInvoiceNumber(), to);
        if (invoice.getStatus() == Invoice.Status.DRAFT) {
            invoice.setStatus(Invoice.Status.SENT);
        }
        invoice.setSentAt(Instant.now());
        invoice = invoiceRepository.save(invoice);
        return InvoiceResponse.from(invoice);
    }
}
