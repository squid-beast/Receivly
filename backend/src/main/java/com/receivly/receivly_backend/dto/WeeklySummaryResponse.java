package com.receivly.receivly_backend.dto;

import com.receivly.receivly_backend.entity.WeeklySummary;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
@AllArgsConstructor
public class WeeklySummaryResponse {
    private UUID id;
    private LocalDate weekStart;
    private LocalDate weekEnd;
    private int invoicesSent;
    private int invoicesPaid;
    private int invoicesOverdue;
    private BigDecimal totalOverdue;
    private BigDecimal totalCollected;
    private BigDecimal totalOutstanding;

    public static WeeklySummaryResponse from(WeeklySummary s) {
        return new WeeklySummaryResponse(
                s.getId(), s.getWeekStart(), s.getWeekEnd(),
                s.getInvoicesSent(), s.getInvoicesPaid(), s.getInvoicesOverdue(),
                s.getTotalOverdue(), s.getTotalCollected(), s.getTotalOutstanding()
        );
    }
}
