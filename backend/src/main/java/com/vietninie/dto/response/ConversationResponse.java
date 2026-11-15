package com.vietninie.dto.response;

import com.fasterxml.jackson.databind.JsonNode;

public record ConversationResponse(
        Integer id,
        String slug,
        String titleVi,
        String titleZh,
        String level,
        String scenarioVi,
        String scenarioZh,
        JsonNode lines) {
}
