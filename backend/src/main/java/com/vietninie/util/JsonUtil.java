package com.vietninie.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Standalone mapper (no snake_case) for the JSON text columns and the seed files.
 * Deliberately not a Spring bean so Boot's auto-configured ObjectMapper (snake_case) is kept.
 */
public final class JsonUtil {

    public static final ObjectMapper MAPPER = new ObjectMapper();

    private JsonUtil() {
    }

    public static String write(Object value) {
        try {
            return MAPPER.writeValueAsString(value);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Cannot serialize JSON", e);
        }
    }

    public static JsonNode read(String json) {
        if (json == null || json.isBlank()) {
            return null;
        }
        try {
            return MAPPER.readTree(json);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Invalid JSON stored in database", e);
        }
    }

    public static String text(JsonNode node, String field) {
        JsonNode v = node.get(field);
        return v == null || v.isNull() ? null : v.asText();
    }
}
