package com.receivly.receivly_backend.dto;

import com.receivly.receivly_backend.entity.Customer;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import java.time.Instant;
import java.util.UUID;

@Data
@AllArgsConstructor
@Builder
public class CustomerResponse {
    private UUID id;
    private String name;
    private String email;
    private String phone;
    private String paymentTerms;
    private String address;
    private String notes;
    private Instant createdAt;

    public static CustomerResponse from(Customer c) {
        return CustomerResponse.builder()
                .id(c.getId())
                .name(c.getName())
                .email(c.getEmail())
                .phone(c.getPhone())
                .paymentTerms(c.getPaymentTerms())
                .address(c.getAddress())
                .notes(c.getNotes())
                .createdAt(c.getCreatedAt())
                .build();
    }
}
