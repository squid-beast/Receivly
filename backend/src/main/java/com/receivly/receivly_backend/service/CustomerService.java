package com.receivly.receivly_backend.service;

import com.receivly.receivly_backend.dto.CustomerRequest;
import com.receivly.receivly_backend.dto.CustomerResponse;
import com.receivly.receivly_backend.entity.Customer;
import com.receivly.receivly_backend.entity.Workspace;
import com.receivly.receivly_backend.repository.CustomerRepository;
import com.receivly.receivly_backend.repository.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final WorkspaceRepository workspaceRepository;

    public List<CustomerResponse> list(UUID workspaceId) {
        return customerRepository.findByWorkspaceIdOrderByCreatedAtDesc(workspaceId)
                .stream()
                .map(CustomerResponse::from)
                .toList();
    }

    @Transactional
    public CustomerResponse create(UUID workspaceId, CustomerRequest request) {
        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new IllegalArgumentException("Workspace not found"));

        Customer customer = Customer.builder()
                .workspace(workspace)
                .name(request.getName())
                .email(request.getEmail())
                .paymentTerms(request.getPaymentTerms())
                .build();
        customer = customerRepository.save(customer);
        return CustomerResponse.from(customer);
    }

    @Transactional
    public CustomerResponse update(UUID workspaceId, UUID customerId, CustomerRequest request) {
        Customer customer = customerRepository.findByIdAndWorkspaceId(customerId, workspaceId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        customer.setName(request.getName());
        customer.setEmail(request.getEmail());
        customer.setPaymentTerms(request.getPaymentTerms());
        customer = customerRepository.save(customer);
        return CustomerResponse.from(customer);
    }

    @Transactional
    public void delete(UUID workspaceId, UUID customerId) {
        Customer customer = customerRepository.findByIdAndWorkspaceId(customerId, workspaceId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));
        customerRepository.delete(customer);
    }
}
