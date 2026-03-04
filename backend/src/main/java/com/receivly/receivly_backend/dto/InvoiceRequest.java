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

    /** Legacy: single description when no line items */
    private String description;

    /** Legacy: single amount when no line items */
    @DecimalMin("0")
    private BigDecimal amount;

    /** Line items (description, quantity, unitPrice). When present, subtotal/total are computed. */
    @Valid
    private List<InvoiceLineItemRequest> lineItems;

    @DecimalMin("0")
    @DecimalMax("100")
    private BigDecimal taxRate = BigDecimal.ZERO;

    @DecimalMin("0")
    private BigDecimal discountAmount = BigDecimal.ZERO;

    /** Issue date; default today if not set */
    private LocalDate issueDate;

    /** When true, invoice is saved as DRAFT; otherwise SENT */
    private Boolean draft;
}
