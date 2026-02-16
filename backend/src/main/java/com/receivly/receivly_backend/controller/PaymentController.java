package com.receivly.receivly_backend.controller;

import com.receivly.receivly_backend.dto.PaymentResponse;
import com.receivly.receivly_backend.entity.Invoice;
import com.receivly.receivly_backend.entity.User;
import com.receivly.receivly_backend.repository.InvoiceRepository;
import com.receivly.receivly_backend.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentRepository paymentRepository;
    private final InvoiceRepository invoiceRepository;

    @GetMapping
    public ResponseEntity<List<PaymentResponse>> listByInvoice(
            @AuthenticationPrincipal User user,
            @RequestParam UUID invoiceId) {
        UUID wsId = user.getWorkspace().getId();
        Invoice invoice = invoiceRepository.findByIdAndWorkspaceId(invoiceId, wsId)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found"));
        List<PaymentResponse> payments = paymentRepository.findByInvoiceIdOrderByPaidAtDesc(invoice.getId())
                .stream()
                .map(PaymentResponse::from)
                .toList();
        return ResponseEntity.ok(payments);
    }
}
