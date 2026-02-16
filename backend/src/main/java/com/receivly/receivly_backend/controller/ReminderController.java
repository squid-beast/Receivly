package com.receivly.receivly_backend.controller;

import com.receivly.receivly_backend.dto.ReminderResponse;
import com.receivly.receivly_backend.entity.Invoice;
import com.receivly.receivly_backend.entity.User;
import com.receivly.receivly_backend.repository.InvoiceRepository;
import com.receivly.receivly_backend.repository.ReminderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/invoices/{invoiceId}/reminders")
@RequiredArgsConstructor
public class ReminderController {

    private final InvoiceRepository invoiceRepository;
    private final ReminderRepository reminderRepository;

    @GetMapping
    public ResponseEntity<List<ReminderResponse>> list(
            @AuthenticationPrincipal User user,
            @PathVariable UUID invoiceId) {
        UUID wsId = user.getWorkspace().getId();
        Invoice invoice = invoiceRepository.findByIdAndWorkspaceId(invoiceId, wsId)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found"));
        List<ReminderResponse> reminders = reminderRepository.findByInvoiceIdOrderBySentAtDesc(invoice.getId())
                .stream()
                .map(ReminderResponse::from)
                .toList();
        return ResponseEntity.ok(reminders);
    }
}
