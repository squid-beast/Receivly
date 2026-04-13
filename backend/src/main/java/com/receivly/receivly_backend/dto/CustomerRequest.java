package com.receivly.receivly_backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CustomerRequest {
    @NotBlank(message = "Business name is required")
    @Size(max = 200)
    private String name;

    @NotBlank(message = "Billing email is required")
    @Email
    @Size(max = 255)
    private String email;

    @Size(max = 30)
    private String phone;

    @NotBlank
    @Pattern(regexp = "^(NET_7|NET_14|NET_30|NET_60)$", message = "Invalid payment terms")
    private String paymentTerms;

    @Size(max = 500)
    private String address;

    @Size(max = 2000)
    private String notes;
}
