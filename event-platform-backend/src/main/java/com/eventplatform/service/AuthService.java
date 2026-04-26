package com.eventplatform.service;

import com.eventplatform.dto.auth.AuthResponse;
import com.eventplatform.dto.auth.CurrentUserResponse;
import com.eventplatform.dto.auth.LoginRequest;
import com.eventplatform.dto.auth.RegisterRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    CurrentUserResponse getCurrentUser(String email);
}