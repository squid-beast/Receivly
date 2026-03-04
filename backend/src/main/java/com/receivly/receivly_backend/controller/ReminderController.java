package com.receivly.receivly_backend.controller;

import com.receivly.receivly_backend.dto.ReminderResponse;
import com.receivly.receivly_backend.entity.User;
import com.receivly.receivly_backend.service.ReminderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/invoices/{invoiceId}/reminders")
@RequiredArgsConstructor
public class ReminderController {

    private final ReminderService reminderService;

    @GetMapping
    public ResponseEntity<List<ReminderResponse>> list(
            @AuthenticationPrincipal User user,
            @PathVariable UUID invoiceId) {
        UUID wsId = user.getWorkspace().getId();
        return ResponseEntity.ok(reminderService.listByInvoiceId(wsId, invoiceId));
    }

    @PostMapping("/send")
    public ResponseEntity<ReminderResponse> sendNow(
            @AuthenticationPrincipal User user,
            @PathVariable UUID invoiceId) {
        UUID wsId = user.getWorkspace().getId();
        return ResponseEntity.ok(reminderService.sendReminderNow(wsId, invoiceId));
    }

    @org.springframework.web.bind.annotation.ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleBadRequest(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
    }
}
