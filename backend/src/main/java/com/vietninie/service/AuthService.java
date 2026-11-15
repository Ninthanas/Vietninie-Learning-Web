package com.vietninie.service;

import com.vietninie.dto.request.LoginRequest;
import com.vietninie.dto.request.RegisterRequest;
import com.vietninie.dto.response.AuthResponse;
import com.vietninie.dto.response.UserResponse;
import com.vietninie.security.UserPrincipal;

public interface AuthService {
    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    UserResponse me(UserPrincipal principal);
}
