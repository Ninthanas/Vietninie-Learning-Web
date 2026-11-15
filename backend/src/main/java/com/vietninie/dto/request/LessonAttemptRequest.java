package com.vietninie.dto.request;

import jakarta.validation.constraints.Min;

public record LessonAttemptRequest(
        @Min(0) int quizScore,
        @Min(0) int quizTotal,
        @Min(0) int stepsCompleted,
        boolean completed) {
}
