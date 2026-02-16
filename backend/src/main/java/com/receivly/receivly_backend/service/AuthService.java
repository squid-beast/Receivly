package com.receivly.receivly_backend.service;

import com.receivly.receivly_backend.dto.AuthResponse;
import com.receivly.receivly_backend.dto.SigninRequest;
import com.receivly.receivly_backend.dto.SignupRequest;
import com.receivly.receivly_backend.entity.User;
import com.receivly.receivly_backend.entity.Workspace;
import com.receivly.receivly_backend.repository.UserRepository;
import com.receivly.receivly_backend.repository.WorkspaceRepository;
import com.receivly.receivly_backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final WorkspaceRepository workspaceRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }

        Workspace workspace = Workspace.builder()
                .businessName(request.getBusinessName())
                .build();
        workspace = workspaceRepository.save(workspace);

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .workspace(workspace)
                .role(User.Role.OWNER)
                .build();
        user = userRepository.save(user);

        String token = jwtUtil.generateToken(user.getId(), workspace.getId(), user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .workspaceId(workspace.getId())
                .businessName(workspace.getBusinessName())
                .onboardingCompleted(workspace.isOnboardingCompleted())
                .build();
    }

    public AuthResponse signin(SigninRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        Workspace workspace = user.getWorkspace();
        String token = jwtUtil.generateToken(user.getId(), workspace.getId(), user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .workspaceId(workspace.getId())
                .businessName(workspace.getBusinessName())
                .onboardingCompleted(workspace.isOnboardingCompleted())
                .build();
    }

    public AuthResponse me(User user) {
        Workspace workspace = user.getWorkspace();
        return AuthResponse.builder()
                .token(null)
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .workspaceId(workspace.getId())
                .businessName(workspace.getBusinessName())
                .onboardingCompleted(workspace.isOnboardingCompleted())
                .build();
    }
}
