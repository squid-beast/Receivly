package com.receivly.receivly_backend.repository;

import com.receivly.receivly_backend.entity.InvoiceLineItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface InvoiceLineItemRepository extends JpaRepository<InvoiceLineItem, UUID> {
}
