package com.vietninie.service;

import com.vietninie.dto.request.LessonAttemptRequest;
import com.vietninie.security.UserPrincipal;

public interface LessonService {
    void recordAttempt(String lessonId, LessonAttemptRequest request, UserPrincipal principal);
}
