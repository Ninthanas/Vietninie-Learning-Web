package com.vietninie.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public record SrsEntryResponse(
        Integer rating,
        Integer reps,
        @JsonProperty("lastReviewed") Long lastReviewed,
        @JsonProperty("nextReview") Long nextReview) {
}
