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
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final WorkspaceRepository workspaceRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    private final RestTemplate googleRestTemplate = new RestTemplate();

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Registration failed. Please try again.");
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
                .timezone(workspace.getTimezone())
                .onboardingCompleted(workspace.isOnboardingCompleted())
                .build();
    }

    @Transactional(readOnly = true)
    public AuthResponse signin(SigninRequest request) {
        User user = userRepository.findByEmailWithWorkspace(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (user.getPassword() == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
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
                .timezone(workspace.getTimezone())
                .onboardingCompleted(workspace.isOnboardingCompleted())
                .build();
    }

    public AuthResponse me(User user) {
        Workspace workspace = user.getWorkspace();
        return AuthResponse.builder()
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .workspaceId(workspace.getId())
                .businessName(workspace.getBusinessName())
                .timezone(workspace.getTimezone())
                .onboardingCompleted(workspace.isOnboardingCompleted())
                .build();
    }

    @Transactional
    public AuthResponse googleAuth(String accessToken) {
        Map<String, Object> googleUser = fetchGoogleUserInfo(accessToken);

        String email = (String) googleUser.get("email");
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Google account has no email");
        }

        Boolean emailVerified = (Boolean) googleUser.get("email_verified");
        if (!Boolean.TRUE.equals(emailVerified)) {
            throw new IllegalArgumentException("Google email is not verified");
        }

        String name = (String) googleUser.get("name");
        if (name == null || name.isBlank()) {
            name = email.split("@")[0];
        }

        Optional<User> existingUser = userRepository.findByEmailWithWorkspace(email);

        if (existingUser.isPresent()) {
            User user = existingUser.get();
            Workspace workspace = user.getWorkspace();
            String token = jwtUtil.generateToken(user.getId(), workspace.getId(), user.getEmail());
            return AuthResponse.builder()
                    .token(token)
                    .userId(user.getId())
                    .fullName(user.getFullName())
                    .email(user.getEmail())
                    .workspaceId(workspace.getId())
                    .businessName(workspace.getBusinessName())
                    .timezone(workspace.getTimezone())
                    .onboardingCompleted(workspace.isOnboardingCompleted())
                    .build();
        }

        Workspace workspace = Workspace.builder()
                .businessName(name + "'s Business")
                .build();
        workspace = workspaceRepository.save(workspace);

        User user = User.builder()
                .fullName(name)
                .email(email)
                .password(null)
                .authProvider(User.AuthProvider.GOOGLE)
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
                .timezone(workspace.getTimezone())
                .onboardingCompleted(workspace.isOnboardingCompleted())
                .build();
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> fetchGoogleUserInfo(String accessToken) {
        try {
            String url = "https://www.googleapis.com/oauth2/v3/userinfo?access_token=" + accessToken;
            Map<String, Object> response = googleRestTemplate.getForObject(url, Map.class);
            if (response == null || !response.containsKey("email")) {
                throw new IllegalArgumentException("Invalid Google access token");
            }
            return response;
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new IllegalArgumentException("Failed to verify Google access token");
        }
    }
}
