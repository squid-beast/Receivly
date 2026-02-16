package com.receivly.receivly_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    private UUID userId;
    private String fullName;
    private String email;
    private UUID workspaceId;
    private String businessName;
    private boolean onboardingCompleted;
}
