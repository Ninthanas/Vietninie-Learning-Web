package com.vietninie.dto.request;

import java.util.List;
import java.util.Map;

/** Local progress pushed to the server after login (merged, never destructive). */
public record ProgressSyncRequest(List<Integer> learned, List<Integer> favorites, Map<Integer, SrsRequest> srs) {
}
