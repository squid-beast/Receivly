package com.receivly.receivly_backend.controller;

import com.receivly.receivly_backend.dto.WeeklySummaryResponse;
import com.receivly.receivly_backend.entity.User;
import com.receivly.receivly_backend.repository.WeeklySummaryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/weekly-summaries")
@RequiredArgsConstructor
public class WeeklySummaryController {

    private final WeeklySummaryRepository weeklySummaryRepository;

    @GetMapping
    public ResponseEntity<List<WeeklySummaryResponse>> list(@AuthenticationPrincipal User user) {
        List<WeeklySummaryResponse> summaries = weeklySummaryRepository
                .findByWorkspaceIdOrderByWeekStartDesc(user.getWorkspace().getId())
                .stream()
                .map(WeeklySummaryResponse::from)
                .toList();
        return ResponseEntity.ok(summaries);
    }
}
