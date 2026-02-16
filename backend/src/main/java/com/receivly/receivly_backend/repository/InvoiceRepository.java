package com.receivly.receivly_backend.repository;

import com.receivly.receivly_backend.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface InvoiceRepository extends JpaRepository<Invoice, UUID> {
    List<Invoice> findByWorkspaceIdOrderByCreatedAtDesc(UUID workspaceId);
    Optional<Invoice> findByIdAndWorkspaceId(UUID id, UUID workspaceId);
    List<Invoice> findByWorkspaceIdAndStatusOrderByDueDateAsc(UUID workspaceId, Invoice.Status status);

    List<Invoice> findByStatusAndDueDateBefore(Invoice.Status status, LocalDate date);

    List<Invoice> findByWorkspaceIdAndStatus(UUID workspaceId, Invoice.Status status);

    @Query("SELECT COALESCE(MAX(CAST(SUBSTRING(i.invoiceNumber, 5) AS int)), 0) FROM Invoice i WHERE i.workspace.id = :workspaceId")
    int findMaxInvoiceNumber(UUID workspaceId);
}
