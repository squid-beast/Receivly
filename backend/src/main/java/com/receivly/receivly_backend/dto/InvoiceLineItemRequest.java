package com.receivly.receivly_backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class InvoiceLineItemRequest {
    @NotBlank
    private String description;

    @NotNull
    @Min(1)
    private Integer quantity = 1;

    @NotNull
    @DecimalMin("0")
    private BigDecimal unitPrice;
}
