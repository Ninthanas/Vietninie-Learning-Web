package com.vietninie.dto.request;

import jakarta.validation.constraints.Min;

public record QuizResultRequest(String mode, @Min(0) int score, @Min(0) int total) {
}
