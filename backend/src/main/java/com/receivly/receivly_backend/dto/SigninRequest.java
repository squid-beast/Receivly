package com.receivly.receivly_backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SigninRequest {
    @NotBlank @Email @Size(max = 255)
    private String email;

    @NotBlank @Size(max = 128)
    private String password;
}
