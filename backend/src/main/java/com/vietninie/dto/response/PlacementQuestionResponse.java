package com.vietninie.dto.response;

import java.util.List;

/** correct_index is intentionally not exposed. */
public record PlacementQuestionResponse(String id, String level, String questionZh, List<String> options) {
}
