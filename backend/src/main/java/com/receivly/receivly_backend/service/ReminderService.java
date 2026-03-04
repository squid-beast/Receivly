package com.receivly.receivly_backend.service;

import com.receivly.receivly_backend.dto.ReminderResponse;
import com.receivly.receivly_backend.entity.Invoice;
import com.receivly.receivly_backend.entity.Reminder;
import com.receivly.receivly_backend.repository.InvoiceRepository;
import com.receivly.receivly_backend.repository.ReminderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReminderService {

    private final InvoiceRepository invoiceRepository;
    private final ReminderRepository reminderRepository;

    /**
     * Manual "Send reminder now" – creates a reminder for the invoice and logs (stub).
     * Only allowed for SENT or OVERDUE invoices. Stops when invoice is PAID.
     */
    @Transactional
    public ReminderResponse sendReminderNow(UUID workspaceId, UUID invoiceId) {
        Invoice invoice = invoiceRepository.findByIdAndWorkspaceId(invoiceId, workspaceId)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found"));
        if (invoice.getStatus() == Invoice.Status.PAID) {
            throw new IllegalArgumentException("Cannot send reminder for a paid invoice");
        }
        LocalDate today = LocalDate.now();
        int daysPastDue = (int) ChronoUnit.DAYS.between(invoice.getDueDate(), today);
        if (daysPastDue < 0) {
            daysPastDue = 0;
        }
        String email = invoice.getCustomer().getEmail();
        log.info("REMINDER (manual): Invoice {} — sending reminder now to {} ({} days past due)",
                invoice.getInvoiceNumber(), email, daysPastDue);
        Reminder reminder = Reminder.builder()
                .invoice(invoice)
                .daysPastDue(daysPastDue)
                .recipientEmail(email)
                .build();
        reminder = reminderRepository.save(reminder);
        return ReminderResponse.from(reminder);
    }

    @Transactional(readOnly = true)
    public List<ReminderResponse> listByInvoiceId(UUID workspaceId, UUID invoiceId) {
        Invoice invoice = invoiceRepository.findByIdAndWorkspaceId(invoiceId, workspaceId)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found"));
        return reminderRepository.findByInvoiceIdOrderBySentAtDesc(invoice.getId())
                .stream()
                .map(ReminderResponse::from)
                .toList();
    }
}
