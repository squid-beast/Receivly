package com.receivly.receivly_backend.dto;

import com.receivly.receivly_backend.entity.Invoice;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Data
@AllArgsConstructor
@Builder
public class InvoiceResponse {
    private UUID id;
    private String invoiceNumber;
    private String description;
    private BigDecimal amount;
    private String currency;
    private String status;
    private LocalDate dueDate;
    private Instant paidAt;
    private Instant createdAt;
    private UUID customerId;
    private String customerName;
    private String customerEmail;

    public static InvoiceResponse from(Invoice inv) {
        return InvoiceResponse.builder()
                .id(inv.getId())
                .invoiceNumber(inv.getInvoiceNumber())
                .description(inv.getDescription())
                .amount(inv.getAmount())
                .currency(inv.getCurrency())
                .status(inv.getStatus().name())
                .dueDate(inv.getDueDate())
                .paidAt(inv.getPaidAt())
                .createdAt(inv.getCreatedAt())
                .customerId(inv.getCustomer().getId())
                .customerName(inv.getCustomer().getName())
                .customerEmail(inv.getCustomer().getEmail())
                .build();
    }
}
