package com.receivly.receivly_backend.repository;

import com.receivly.receivly_backend.entity.Reminder;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ReminderRepository extends JpaRepository<Reminder, UUID> {
    List<Reminder> findByInvoiceIdOrderBySentAtDesc(UUID invoiceId);
    boolean existsByInvoiceIdAndDaysPastDue(UUID invoiceId, int daysPastDue);
}
