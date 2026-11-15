package com.vietninie.dto.response;

public record ProgressSummaryResponse(
        long learnedZh,
        long learnedVi,
        long favoritesZh,
        long favoritesVi,
        long quizCount,
        int quizAverageAccuracy,
        long lessonsCompleted,
        String placementLevel) {
}
