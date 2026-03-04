package com.receivly.receivly_backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CustomerRequest {
    @NotBlank(message = "Business name is required")
    private String name;

    @NotBlank(message = "Billing email is required")
    @Email
    private String email;

    private String phone;

    @NotBlank
    private String paymentTerms;

    private String address;

    private String notes;
}
