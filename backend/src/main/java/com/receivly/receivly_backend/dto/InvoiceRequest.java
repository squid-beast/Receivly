package com.receivly.receivly_backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
public class InvoiceRequest {
    @NotNull
    private UUID customerId;

    @Size(max = 500)
    private String description;

    @DecimalMin("0")
    private BigDecimal amount;

    @Valid
    private List<InvoiceLineItemRequest> lineItems;

    @DecimalMin("0")
    @DecimalMax("100")
    private BigDecimal taxRate = BigDecimal.ZERO;

    @DecimalMin("0")
    private BigDecimal discountAmount = BigDecimal.ZERO;

    private LocalDate issueDate;

    private Boolean draft;
}
