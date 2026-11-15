package com.vietninie.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;

/** Same shape the client keeps in localStorage: {rating, reps, lastReviewed, nextReview}. */
public record SrsRequest(
        Integer rating,
        Integer reps,
        @JsonProperty("lastReviewed") Long lastReviewed,
        @JsonProperty("nextReview") Long nextReview) {
}
