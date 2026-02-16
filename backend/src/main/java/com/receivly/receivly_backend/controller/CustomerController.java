package com.receivly.receivly_backend.controller;

import com.receivly.receivly_backend.dto.CustomerRequest;
import com.receivly.receivly_backend.dto.CustomerResponse;
import com.receivly.receivly_backend.entity.User;
import com.receivly.receivly_backend.service.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping
    public ResponseEntity<List<CustomerResponse>> list(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(customerService.list(user.getWorkspace().getId()));
    }

    @PostMapping
    public ResponseEntity<CustomerResponse> create(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CustomerRequest request) {
        return ResponseEntity.ok(customerService.create(user.getWorkspace().getId(), request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerResponse> update(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id,
            @Valid @RequestBody CustomerRequest request) {
        return ResponseEntity.ok(customerService.update(user.getWorkspace().getId(), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id) {
        customerService.delete(user.getWorkspace().getId(), id);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleBadRequest(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
    }
}
