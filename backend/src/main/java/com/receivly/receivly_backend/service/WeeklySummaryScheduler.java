package com.receivly.receivly_backend.service;

import com.receivly.receivly_backend.entity.Invoice;
import com.receivly.receivly_backend.entity.WeeklySummary;
import com.receivly.receivly_backend.entity.Workspace;
import com.receivly.receivly_backend.repository.InvoiceRepository;
import com.receivly.receivly_backend.repository.WeeklySummaryRepository;
import com.receivly.receivly_backend.repository.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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

    private static final int WORKSPACE_BATCH_SIZE = 50;

    @Scheduled(cron = "0 0 9 * * MON") // every Monday at 9 AM
    @Transactional
    public void generateWeeklySummaries() {
        LocalDate weekEnd = LocalDate.now().with(DayOfWeek.SUNDAY).minusWeeks(1).plusDays(6);
        LocalDate weekStart = weekEnd.minusDays(6);

        int page = 0;
        Page<Workspace> workspacePage;
        do {
            workspacePage = workspaceRepository.findAll(PageRequest.of(page, WORKSPACE_BATCH_SIZE));
            for (Workspace ws : workspacePage.getContent()) {
                if (weeklySummaryRepository.existsByWorkspaceIdAndWeekStart(ws.getId(), weekStart)) {
                    continue;
                }
                generateSummaryForWorkspace(ws, weekStart, weekEnd);
            }
            page++;
        } while (workspacePage.hasNext());
    }

    private void generateSummaryForWorkspace(Workspace ws, LocalDate weekStart, LocalDate weekEnd) {
        List<Invoice> sentInvoices = invoiceRepository.findByWorkspaceIdAndStatus(ws.getId(), Invoice.Status.SENT);
        List<Invoice> overdueInvoices = invoiceRepository.findByWorkspaceIdAndStatus(ws.getId(), Invoice.Status.OVERDUE);
        List<Invoice> paidInvoices = invoiceRepository.findByWorkspaceIdAndStatus(ws.getId(), Invoice.Status.PAID);

        BigDecimal collected = paidInvoices.stream()
                .map(Invoice::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal overdueAmount = overdueInvoices.stream()
                .map(Invoice::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal outstanding = sentInvoices.stream()
                .map(Invoice::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .add(overdueAmount);

        WeeklySummary summary = WeeklySummary.builder()
                .workspace(ws)
                .weekStart(weekStart)
                .weekEnd(weekEnd)
                .invoicesSent(sentInvoices.size())
                .invoicesPaid(paidInvoices.size())
                .invoicesOverdue(overdueInvoices.size())
                .totalOverdue(overdueAmount)
                .totalCollected(collected)
                .totalOutstanding(outstanding)
                .build();
        weeklySummaryRepository.save(summary);

        log.info("WEEKLY SUMMARY for {}: invoicesSent={}, paymentsReceived={}, overdueCount={}, overdueAmount={}, totalCollected={}, totalOutstanding={}",
                ws.getBusinessName(), sentInvoices.size(), paidInvoices.size(), overdueInvoices.size(), overdueAmount, collected, outstanding);
    }
}
