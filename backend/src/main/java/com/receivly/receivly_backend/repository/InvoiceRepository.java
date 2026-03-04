package com.receivly.receivly_backend.repository;

import com.receivly.receivly_backend.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface InvoiceRepository extends JpaRepository<Invoice, UUID> {
    List<Invoice> findByWorkspaceIdOrderByCreatedAtDesc(UUID workspaceId);

    Optional<Invoice> findByIdAndWorkspaceId(UUID id, UUID workspaceId);

    List<Invoice> findByWorkspaceIdAndStatusOrderByDueDateAsc(UUID workspaceId, Invoice.Status status);

    List<Invoice> findByWorkspaceIdAndStatusAndDueDateBefore(UUID workspaceId, Invoice.Status status, LocalDate date);

    List<Invoice> findByWorkspaceIdAndStatus(UUID workspaceId, Invoice.Status status);

    /**
     * Returns the maximum numeric sequence used in invoice_number for the given workspace.
     * Assumes invoice_number format: INV-YYYY-CLIENT_CODE-00000 and extracts the 4th part.
     */
    @Query(
            value = """
                    SELECT COALESCE(
                        MAX(CAST(split_part(i.invoice_number, '-', 4) AS int)),
                        0
                    )
                    FROM invoices i
                    WHERE i.workspace_id = :workspaceId
                    """,
            nativeQuery = true
    )
    int findMaxInvoiceNumber(@Param("workspaceId") UUID workspaceId);
}
