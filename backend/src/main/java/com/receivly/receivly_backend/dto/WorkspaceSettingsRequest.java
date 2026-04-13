package com.receivly.receivly_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class WorkspaceSettingsRequest {
    @NotBlank
    @Size(max = 200)
    private String businessName;

    @NotBlank
    @Size(min = 3, max = 3)
    private String currency;

    @NotBlank
    @Pattern(regexp = "^(NET_7|NET_14|NET_30|NET_60)$", message = "Invalid payment terms")
    private String defaultPaymentTerms;

    @NotBlank
    @Size(max = 100)
    private String timezone;

    private Boolean reminderAutomationEnabled;

    @Size(max = 500)
    private String address;
}
