package com.vietninie.dto.response;

import java.util.List;
import java.util.Map;

public record ProgressResponse(List<Integer> learned, List<Integer> favorites, Map<Integer, SrsEntryResponse> srs) {
}
