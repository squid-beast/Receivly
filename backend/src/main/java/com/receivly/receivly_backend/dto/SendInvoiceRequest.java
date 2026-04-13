package com.receivly.receivly_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SendInvoiceRequest {

    @NotBlank(message = "pdfBase64 is required")
    private String pdfBase64;

    @Size(max = 255)
    @Pattern(regexp = "^[a-zA-Z0-9._\\- ]*\\.pdf$", message = "Invalid file name")
    private String fileName;
}
