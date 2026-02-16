package com.receivly.receivly_backend.dto;

import com.receivly.receivly_backend.entity.Payment;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@AllArgsConstructor
public class PaymentResponse {
    private UUID id;
    private UUID invoiceId;
    private String invoiceNumber;
    private BigDecimal amount;
    private String currency;
    private String note;
    private Instant paidAt;

    public static PaymentResponse from(Payment p) {
        return new PaymentResponse(
                p.getId(),
                p.getInvoice().getId(),
                p.getInvoice().getInvoiceNumber(),
                p.getAmount(),
                p.getCurrency(),
                p.getNote(),
                p.getPaidAt()
        );
    }
}
