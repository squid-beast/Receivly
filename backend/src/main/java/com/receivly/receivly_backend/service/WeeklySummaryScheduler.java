package com.receivly.receivly_backend.service;

import com.receivly.receivly_backend.entity.Invoice;
import com.receivly.receivly_backend.entity.WeeklySummary;
import com.receivly.receivly_backend.entity.Workspace;
import com.receivly.receivly_backend.repository.InvoiceRepository;
import com.receivly.receivly_backend.repository.WeeklySummaryRepository;
import com.receivly.receivly_backend.repository.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class WeeklySummaryScheduler {

    private final WorkspaceRepository workspaceRepository;
    private final InvoiceRepository invoiceRepository;
    private final WeeklySummaryRepository weeklySummaryRepository;

    @Scheduled(cron = "0 0 9 * * MON") // every Monday at 9 AM
    @Transactional
    public void generateWeeklySummaries() {
        LocalDate weekEnd = LocalDate.now().with(DayOfWeek.SUNDAY).minusWeeks(1).plusDays(6);
        LocalDate weekStart = weekEnd.minusDays(6);

        List<Workspace> workspaces = workspaceRepository.findAll();
        for (Workspace ws : workspaces) {
            if (weeklySummaryRepository.existsByWorkspaceIdAndWeekStart(ws.getId(), weekStart)) {
                continue; // already generated
            }

            List<Invoice> allInvoices = invoiceRepository.findByWorkspaceIdOrderByCreatedAtDesc(ws.getId());

            int sent = 0, paid = 0, overdue = 0;
            BigDecimal collected = BigDecimal.ZERO;
            BigDecimal outstanding = BigDecimal.ZERO;

            for (Invoice inv : allInvoices) {
                switch (inv.getStatus()) {
                    case SENT -> { sent++; outstanding = outstanding.add(inv.getAmount()); }
                    case OVERDUE -> { overdue++; outstanding = outstanding.add(inv.getAmount()); }
                    case PAID -> { paid++; collected = collected.add(inv.getAmount()); }
                }
            }

            WeeklySummary summary = WeeklySummary.builder()
                    .workspace(ws)
                    .weekStart(weekStart)
                    .weekEnd(weekEnd)
                    .invoicesSent(sent)
                    .invoicesPaid(paid)
                    .invoicesOverdue(overdue)
                    .totalCollected(collected)
                    .totalOutstanding(outstanding)
                    .build();
            weeklySummaryRepository.save(summary);

            log.info("WEEKLY SUMMARY for {}: sent={}, paid={}, overdue={}, collected={}, outstanding={}",
                    ws.getBusinessName(), sent, paid, overdue, collected, outstanding);
        }
    }
}
