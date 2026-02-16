package com.receivly.receivly_backend.repository;

import com.receivly.receivly_backend.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    List<Payment> findByInvoiceIdOrderByPaidAtDesc(UUID invoiceId);
}
