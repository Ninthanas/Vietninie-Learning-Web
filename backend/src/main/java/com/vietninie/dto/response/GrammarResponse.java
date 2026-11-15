package com.vietninie.dto.response;

import com.fasterxml.jackson.databind.JsonNode;

public record GrammarResponse(
        Integer id,
        String title,
        String pattern,
        String level,
        String explanation,
        String exercisePrompt,
        JsonNode examples,
        JsonNode quiz) {
}
