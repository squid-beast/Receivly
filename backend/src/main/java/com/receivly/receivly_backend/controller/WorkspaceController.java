package com.receivly.receivly_backend.controller;

import com.receivly.receivly_backend.dto.OnboardingRequest;
import com.receivly.receivly_backend.dto.WorkspaceSettingsRequest;
import com.receivly.receivly_backend.entity.User;
import com.receivly.receivly_backend.entity.Workspace;
import com.receivly.receivly_backend.service.WorkspaceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/workspaces")
@RequiredArgsConstructor
public class WorkspaceController {

    private final WorkspaceService workspaceService;

    @PatchMapping("/onboarding")
    public ResponseEntity<Map<String, Object>> completeOnboarding(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody OnboardingRequest request) {
        Workspace workspace = workspaceService.completeOnboarding(
                user.getWorkspace().getId(), request);
        return ResponseEntity.ok(Map.of(
                "workspaceId", workspace.getId(),
                "businessName", workspace.getBusinessName(),
                "currency", workspace.getCurrency(),
                "defaultPaymentTerms", workspace.getDefaultPaymentTerms(),
                "timezone", workspace.getTimezone(),
                "onboardingCompleted", workspace.isOnboardingCompleted()
        ));
    }

    @GetMapping("/settings")
    public ResponseEntity<Map<String, Object>> getSettings(@AuthenticationPrincipal User user) {
        Workspace workspace = workspaceService.getById(user.getWorkspace().getId());
        return ResponseEntity.ok(Map.of(
                "businessName", workspace.getBusinessName(),
                "currency", workspace.getCurrency(),
                "defaultPaymentTerms", workspace.getDefaultPaymentTerms(),
                "timezone", workspace.getTimezone(),
                "reminderAutomationEnabled", workspace.isReminderAutomationEnabled(),
                "address", workspace.getAddress() != null ? workspace.getAddress() : ""
        ));
    }

    @PutMapping("/settings")
    public ResponseEntity<Map<String, Object>> updateSettings(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody WorkspaceSettingsRequest request) {
        Workspace workspace = workspaceService.updateSettings(
                user.getWorkspace().getId(), request);
        return ResponseEntity.ok(Map.of(
                "businessName", workspace.getBusinessName(),
                "currency", workspace.getCurrency(),
                "defaultPaymentTerms", workspace.getDefaultPaymentTerms(),
                "timezone", workspace.getTimezone(),
                "reminderAutomationEnabled", workspace.isReminderAutomationEnabled(),
                "address", workspace.getAddress() != null ? workspace.getAddress() : ""
        ));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleBadRequest(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
    }
}
