package com.receivly.receivly_backend.repository;

import com.receivly.receivly_backend.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CustomerRepository extends JpaRepository<Customer, UUID> {
    List<Customer> findByWorkspaceIdOrderByCreatedAtDesc(UUID workspaceId);
    Optional<Customer> findByIdAndWorkspaceId(UUID id, UUID workspaceId);
}
