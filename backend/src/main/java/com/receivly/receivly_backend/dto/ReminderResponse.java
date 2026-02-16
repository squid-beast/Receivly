package com.receivly.receivly_backend.dto;

import com.receivly.receivly_backend.entity.Reminder;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
@AllArgsConstructor
public class ReminderResponse {
    private UUID id;
    private int daysPastDue;
    private String recipientEmail;
    private Instant sentAt;

    public static ReminderResponse from(Reminder r) {
        return new ReminderResponse(r.getId(), r.getDaysPastDue(), r.getRecipientEmail(), r.getSentAt());
    }
}
