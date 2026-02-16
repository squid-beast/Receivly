package com.receivly.receivly_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class WorkspaceSettingsRequest {
    @NotBlank
    private String businessName;

    @NotBlank @Size(min = 3, max = 3)
    private String currency;

    @NotBlank
    private String defaultPaymentTerms;
}
