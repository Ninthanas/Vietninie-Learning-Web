package com.vietninie.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record PlacementSubmitRequest(@NotNull(message = "Thiếu câu trả lời") @Valid List<Answer> answers) {

    public record Answer(@NotNull String questionId, @NotNull Integer selectedIndex) {
    }
}
