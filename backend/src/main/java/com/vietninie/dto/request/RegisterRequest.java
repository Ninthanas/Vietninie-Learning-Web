package com.vietninie.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "Vui lòng nhập tên đăng nhập")
        @Size(min = 3, max = 50, message = "Tên đăng nhập phải từ 3 đến 50 ký tự")
        @Pattern(regexp = "^[A-Za-z0-9_.@-]+$", message = "Tên đăng nhập chỉ gồm chữ, số và _ . @ -")
        String username,

        @NotBlank(message = "Vui lòng nhập mật khẩu")
        @Size(min = 6, max = 100, message = "Mật khẩu phải có ít nhất 6 ký tự")
        String password,

        @Size(max = 100, message = "Tên hiển thị tối đa 100 ký tự")
        String displayName) {
}
