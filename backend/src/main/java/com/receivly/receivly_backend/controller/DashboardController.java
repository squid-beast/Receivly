package com.receivly.receivly_backend.controller;

import com.receivly.receivly_backend.entity.Invoice;
import com.receivly.receivly_backend.entity.User;
import com.receivly.receivly_backend.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final InvoiceRepository invoiceRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> stats(@AuthenticationPrincipal User user) {
        UUID wsId = user.getWorkspace().getId();
        List<Invoice> all = invoiceRepository.findByWorkspaceIdOrderByCreatedAtDesc(wsId);

        BigDecimal totalSent = BigDecimal.ZERO;
        BigDecimal totalOverdue = BigDecimal.ZERO;
        BigDecimal totalPaid = BigDecimal.ZERO;
        BigDecimal paidThisWeek = BigDecimal.ZERO;
        int countSent = 0, countOverdue = 0, countPaid = 0;

        Instant weekAgo = Instant.now().minus(7, ChronoUnit.DAYS);

        for (Invoice inv : all) {
            switch (inv.getStatus()) {
                case SENT -> { totalSent = totalSent.add(inv.getAmount()); countSent++; }
                case OVERDUE -> { totalOverdue = totalOverdue.add(inv.getAmount()); countOverdue++; }
                case PAID -> {
                    totalPaid = totalPaid.add(inv.getAmount());
                    countPaid++;
                    if (inv.getPaidAt() != null && !inv.getPaidAt().isBefore(weekAgo)) {
                        paidThisWeek = paidThisWeek.add(inv.getAmount());
                    }
                }
            }
        }

        BigDecimal totalOutstanding = totalSent.add(totalOverdue);

        return ResponseEntity.ok(Map.of(
                "totalSent", totalSent,
                "totalOverdue", totalOverdue,
                "totalPaid", totalPaid,
                "totalOutstanding", totalOutstanding,
                "paidThisWeek", paidThisWeek,
                "countSent", countSent,
                "countOverdue", countOverdue,
                "countPaid", countPaid,
                "currency", user.getWorkspace().getCurrency()
        ));
    }
}
