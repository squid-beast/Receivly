package com.receivly.receivly_backend.repository;

import com.receivly.receivly_backend.entity.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface WorkspaceRepository extends JpaRepository<Workspace, UUID> {
    List<Workspace> findByReminderAutomationEnabledTrue();
}
