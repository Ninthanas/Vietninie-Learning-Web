package com.vietninie.service;

import com.fasterxml.jackson.databind.JsonNode;

public interface SpecializedService {
    /** Workplace / interview vocabulary document (served as-is). */
    JsonNode get();
}
