package com.vietninie.service;

import com.vietninie.dto.request.ProgressSyncRequest;
import com.vietninie.dto.request.QuizResultRequest;
import com.vietninie.dto.request.SrsRequest;
import com.vietninie.dto.response.ProgressResponse;
import com.vietninie.dto.response.ProgressSummaryResponse;
import com.vietninie.enums.Direction;

public interface ProgressService {
    ProgressResponse get(Long userId, Direction direction);

    void setLearned(Long userId, Direction direction, int itemNo, boolean value);

    void setFavorite(Long userId, Direction direction, int itemNo, boolean value);

    void saveSrs(Long userId, Direction direction, int itemNo, SrsRequest srs);

    /** Merge local progress into the server copy (union of flags, newest SRS wins); returns the merged state. */
    ProgressResponse sync(Long userId, Direction direction, ProgressSyncRequest request);

    void reset(Long userId, Direction direction);

    void saveQuizResult(Long userId, Direction direction, QuizResultRequest request);

    ProgressSummaryResponse summary(Long userId);
}
