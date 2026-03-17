package com.receivly.receivly_backend.controller;

import com.receivly.receivly_backend.dto.InvoiceRequest;
import com.receivly.receivly_backend.dto.InvoiceResponse;
import com.receivly.receivly_backend.dto.InvoiceUpdateRequest;
import com.receivly.receivly_backend.dto.SendInvoiceRequest;
import com.receivly.receivly_backend.entity.User;
import com.receivly.receivly_backend.service.InvoiceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;

    @GetMapping
    public ResponseEntity<List<InvoiceResponse>> list(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(invoiceService.list(user.getWorkspace().getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<InvoiceResponse> getById(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id) {
        return ResponseEntity.ok(invoiceService.getById(user.getWorkspace().getId(), id));
    }

    @PostMapping
    public ResponseEntity<InvoiceResponse> create(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody InvoiceRequest request) {
        return ResponseEntity.ok(invoiceService.create(user.getWorkspace().getId(), request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<InvoiceResponse> update(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id,
            @Valid @RequestBody InvoiceUpdateRequest request) {
        return ResponseEntity.ok(invoiceService.update(user.getWorkspace().getId(), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id) {
        invoiceService.delete(user.getWorkspace().getId(), id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/send")
    public ResponseEntity<InvoiceResponse> sendToClient(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id,
            @Valid @RequestBody SendInvoiceRequest request) {
        return ResponseEntity.ok(invoiceService.sendToClient(user.getWorkspace().getId(), id, request));
    }

    @PatchMapping("/{id}/pay")
    public ResponseEntity<InvoiceResponse> markAsPaid(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id) {
        return ResponseEntity.ok(invoiceService.markAsPaid(user.getWorkspace().getId(), id));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleBadRequest(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
    }
}
