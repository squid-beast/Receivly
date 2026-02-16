package com.receivly.receivly_backend.repository;

import com.receivly.receivly_backend.entity.WeeklySummary;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface WeeklySummaryRepository extends JpaRepository<WeeklySummary, UUID> {
    List<WeeklySummary> findByWorkspaceIdOrderByWeekStartDesc(UUID workspaceId);
    boolean existsByWorkspaceIdAndWeekStart(UUID workspaceId, java.time.LocalDate weekStart);
}
