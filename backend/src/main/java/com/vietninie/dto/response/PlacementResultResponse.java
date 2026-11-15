package com.vietninie.dto.response;

import java.util.List;

public record PlacementResultResponse(
        String recommendedLevel,
        List<LevelScore> levelScores,
        int totalCorrect,
        int totalQuestions) {

    public record LevelScore(String level, int correct, int total, int percentage) {
    }
}
