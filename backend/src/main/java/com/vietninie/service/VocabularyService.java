package com.vietninie.service;

import com.vietninie.dto.request.VocabularyRequest;
import com.vietninie.dto.response.VocabularyResponse;
import com.vietninie.enums.Direction;

import java.util.List;

public interface VocabularyService {
    /** Optional filters; null/blank means "no filter". */
    List<VocabularyResponse> list(Direction direction, String topic, String level, String q);

    VocabularyResponse get(Direction direction, int itemNo);

    VocabularyResponse create(Direction direction, VocabularyRequest request);

    VocabularyResponse update(Direction direction, int itemNo, VocabularyRequest request);

    void delete(Direction direction, int itemNo);
}
