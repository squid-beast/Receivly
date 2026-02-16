package com.receivly.receivly_backend.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;

@Data
public class InvoiceRequest {
    @NotNull
    private UUID customerId;

    @NotBlank
    private String description;

    @NotNull @DecimalMin("0.01")
    private BigDecimal amount;
}
