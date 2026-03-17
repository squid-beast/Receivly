package com.receivly.receivly_backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SendInvoiceRequest {

    @NotBlank(message = "pdfBase64 is required")
    private String pdfBase64;

    private String fileName;
}
