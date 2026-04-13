package com.receivly.receivly_backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class InvoiceLineItemRequest {
    @NotBlank
    @Size(max = 500)
    private String description;

    @NotNull
    @Min(1)
    private Integer quantity = 1;

    @NotNull
    @DecimalMin("0")
    private BigDecimal unitPrice;
}
