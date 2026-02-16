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
    private String paymentTerms;
    private Instant createdAt;

    public static CustomerResponse from(Customer c) {
        return CustomerResponse.builder()
                .id(c.getId())
                .name(c.getName())
                .email(c.getEmail())
                .paymentTerms(c.getPaymentTerms())
                .createdAt(c.getCreatedAt())
                .build();
    }
}
