package com.receivly.receivly_backend.service;

import com.receivly.receivly_backend.dto.OnboardingRequest;
import com.receivly.receivly_backend.dto.WorkspaceSettingsRequest;
import com.receivly.receivly_backend.entity.Workspace;
import com.receivly.receivly_backend.repository.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WorkspaceService {

    private final WorkspaceRepository workspaceRepository;

    @Transactional
    public Workspace completeOnboarding(UUID workspaceId, OnboardingRequest request) {
        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new IllegalArgumentException("Workspace not found"));

        workspace.setCurrency(request.getCurrency());
        workspace.setDefaultPaymentTerms(request.getDefaultPaymentTerms());
        workspace.setTimezone(request.getTimezone());
        workspace.setOnboardingCompleted(true);

        return workspaceRepository.save(workspace);
    }

    @Transactional
    public Workspace updateSettings(UUID workspaceId, WorkspaceSettingsRequest request) {
        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new IllegalArgumentException("Workspace not found"));

        workspace.setBusinessName(request.getBusinessName());
        workspace.setCurrency(request.getCurrency());
        workspace.setDefaultPaymentTerms(request.getDefaultPaymentTerms());
        workspace.setTimezone(request.getTimezone());
        if (request.getReminderAutomationEnabled() != null) {
            workspace.setReminderAutomationEnabled(request.getReminderAutomationEnabled());
        }
        if (request.getAddress() != null) {
            workspace.setAddress(request.getAddress());
        }

        return workspaceRepository.save(workspace);
    }

    public Workspace getById(UUID workspaceId) {
        return workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new IllegalArgumentException("Workspace not found"));
    }
}
