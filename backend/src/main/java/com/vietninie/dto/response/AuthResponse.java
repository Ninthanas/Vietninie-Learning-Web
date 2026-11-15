package com.vietninie.dto.response;

public record AuthResponse(String accessToken, String tokenType, Long userId, String username, String displayName, String role) {
}
