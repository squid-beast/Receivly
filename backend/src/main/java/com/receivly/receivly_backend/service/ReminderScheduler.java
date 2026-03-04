package com.receivly.receivly_backend.service;

import com.receivly.receivly_backend.entity.Invoice;
import com.receivly.receivly_backend.entity.Reminder;
import com.receivly.receivly_backend.entity.Workspace;
import com.receivly.receivly_backend.repository.InvoiceRepository;
import com.receivly.receivly_backend.repository.ReminderRepository;
import com.receivly.receivly_backend.repository.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReminderScheduler {

    private static final int[] REMINDER_DAYS = {7, 14, 21};

    private final WorkspaceRepository workspaceRepository;
    private final InvoiceRepository invoiceRepository;
    private final ReminderRepository reminderRepository;

    @Scheduled(cron = "0 0 8 * * *") // daily at 8 AM
    @Transactional
    public void processOverdueInvoices() {
        LocalDate today = LocalDate.now();
        List<Workspace> enabledWorkspaces = workspaceRepository.findByReminderAutomationEnabledTrue();

        for (Workspace workspace : enabledWorkspaces) {
            // Mark SENT invoices as OVERDUE if past due date
            List<Invoice> overdueInvoices = invoiceRepository.findByWorkspaceIdAndStatusAndDueDateBefore(
                    workspace.getId(), Invoice.Status.SENT, today);
            for (Invoice invoice : overdueInvoices) {
                invoice.setStatus(Invoice.Status.OVERDUE);
                invoiceRepository.save(invoice);
                log.info("Marked invoice {} as OVERDUE", invoice.getInvoiceNumber());
            }

            // Send reminders for OVERDUE invoices at 7, 14, 21 days past due
            List<Invoice> allOverdue = invoiceRepository.findByWorkspaceIdAndStatusAndDueDateBefore(
                    workspace.getId(), Invoice.Status.OVERDUE, today);
            for (Invoice invoice : allOverdue) {
                int daysPast = (int) ChronoUnit.DAYS.between(invoice.getDueDate(), today);
                for (int threshold : REMINDER_DAYS) {
                    if (daysPast >= threshold && !reminderRepository.existsByInvoiceIdAndDaysPastDue(invoice.getId(), threshold)) {
                        sendReminder(invoice, threshold);
                    }
                }
            }
        }
    }

    private void sendReminder(Invoice invoice, int daysPastDue) {
        String email = invoice.getCustomer().getEmail();

        // Email stub — log instead of sending
        log.info("REMINDER: Invoice {} is {} days overdue. Sending reminder to {}",
                invoice.getInvoiceNumber(), daysPastDue, email);

        Reminder reminder = Reminder.builder()
                .invoice(invoice)
                .daysPastDue(daysPastDue)
                .recipientEmail(email)
                .build();
        reminderRepository.save(reminder);
    }
}
