package com.receivly.receivly_backend.repository;

import com.receivly.receivly_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    @Query("SELECT u FROM User u JOIN FETCH u.workspace WHERE u.id = :id")
    Optional<User> findByIdWithWorkspace(UUID id);
}
