package com.receivly.receivly_backend.dto;

import com.receivly.receivly_backend.entity.InvoiceLineItem;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@AllArgsConstructor
public class InvoiceLineItemResponse {
    private UUID id;
    private String description;
    private int quantity;
    private BigDecimal unitPrice;
    private BigDecimal amount;

    public static InvoiceLineItemResponse from(InvoiceLineItem item) {
        return new InvoiceLineItemResponse(
                item.getId(),
                item.getDescription(),
                item.getQuantity(),
                item.getUnitPrice(),
                item.getAmount()
        );
    }
}
