package com.vietninie.service.impl;

import com.vietninie.dto.request.LoginRequest;
import com.vietninie.dto.request.RegisterRequest;
import com.vietninie.dto.response.AuthResponse;
import com.vietninie.dto.response.UserResponse;
import com.vietninie.enums.Role;
import com.vietninie.exception.ConflictException;
import com.vietninie.model.User;
import com.vietninie.repository.UserRepository;
import com.vietninie.security.JwtService;
import com.vietninie.security.UserPrincipal;
import com.vietninie.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String username = request.username().trim();
        if (userRepository.existsByUsernameIgnoreCase(username)) {
            throw new ConflictException("Tên đăng nhập đã tồn tại");
        }
        String display = request.displayName() == null || request.displayName().isBlank()
                ? username : request.displayName().trim();
        User user = userRepository.save(User.builder()
                .username(username)
                .passwordHash(passwordEncoder.encode(request.password()))
                .displayName(display)
                .role(Role.USER)
                .build());
        return toAuth(new UserPrincipal(user));
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username().trim(), request.password()));
        return toAuth((UserPrincipal) auth.getPrincipal());
    }

    @Override
    public UserResponse me(UserPrincipal p) {
        return new UserResponse(p.getId(), p.getUsername(), p.getDisplayName(), p.getRole());
    }

    private AuthResponse toAuth(UserPrincipal p) {
        return new AuthResponse(jwtService.generateToken(p), "Bearer", p.getId(), p.getUsername(),
                p.getDisplayName(), p.getRole());
    }
}
