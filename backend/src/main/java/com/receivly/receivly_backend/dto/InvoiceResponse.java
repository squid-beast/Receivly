package com.receivly.receivly_backend.dto;

import com.receivly.receivly_backend.entity.Invoice;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@Builder
public class InvoiceResponse {
    private UUID id;
    private String invoiceNumber;
    private String description;
    private BigDecimal amount;
    private BigDecimal subtotal;
    private BigDecimal taxRate;
    private BigDecimal discountAmount;
    private String currency;
    private String status;
    private LocalDate issueDate;
    private LocalDate dueDate;
    private Instant paidAt;
    private Instant sentAt;
    private Instant createdAt;
    private UUID customerId;
    private String customerName;
    private String customerEmail;
    private String customerAddress;
    private String workspaceAddress;
    private List<InvoiceLineItemResponse> lineItems;

    public static InvoiceResponse from(Invoice inv) {
        List<InvoiceLineItemResponse> items = inv.getLineItems() == null || inv.getLineItems().isEmpty()
                ? Collections.emptyList()
                : inv.getLineItems().stream().map(InvoiceLineItemResponse::from).collect(Collectors.toList());
        return InvoiceResponse.builder()
                .id(inv.getId())
                .invoiceNumber(inv.getInvoiceNumber())
                .description(inv.getDescription())
                .amount(inv.getAmount())
                .subtotal(inv.getSubtotal() != null ? inv.getSubtotal() : inv.getAmount())
                .taxRate(inv.getTaxRate() != null ? inv.getTaxRate() : BigDecimal.ZERO)
                .discountAmount(inv.getDiscountAmount() != null ? inv.getDiscountAmount() : BigDecimal.ZERO)
                .currency(inv.getCurrency())
                .status(inv.getStatus().name())
                .issueDate(inv.getIssueDate())
                .dueDate(inv.getDueDate())
                .paidAt(inv.getPaidAt())
                .sentAt(inv.getSentAt())
                .createdAt(inv.getCreatedAt())
                .customerId(inv.getCustomer().getId())
                .customerName(inv.getCustomer().getName())
                .customerEmail(inv.getCustomer().getEmail())
                .customerAddress(inv.getCustomer().getAddress())
                .workspaceAddress(inv.getWorkspace().getAddress())
                .lineItems(items)
                .build();
    }
}
