package com.receivly.receivly_backend.service;

import com.receivly.receivly_backend.dto.InvoiceRequest;
import com.receivly.receivly_backend.dto.InvoiceResponse;
import com.receivly.receivly_backend.entity.Customer;
import com.receivly.receivly_backend.entity.Invoice;
import com.receivly.receivly_backend.entity.Payment;
import com.receivly.receivly_backend.entity.Workspace;
import com.receivly.receivly_backend.repository.CustomerRepository;
import com.receivly.receivly_backend.repository.InvoiceRepository;
import com.receivly.receivly_backend.repository.PaymentRepository;
import com.receivly.receivly_backend.repository.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.Year;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
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

        Invoice invoice = Invoice.builder()
                .workspace(workspace)
                .customer(customer)
                .invoiceNumber(invoiceNumber)
                .description(request.getDescription())
                .amount(request.getAmount())
                .currency(workspace.getCurrency())
                .dueDate(LocalDate.now().plusDays(daysToAdd))
                .build();
        invoice = invoiceRepository.save(invoice);
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
}
