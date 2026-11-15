package com.vietninie.service.impl;

import com.vietninie.dto.request.LessonAttemptRequest;
import com.vietninie.model.LessonAttempt;
import com.vietninie.repository.LessonAttemptRepository;
import com.vietninie.repository.UserRepository;
import com.vietninie.security.UserPrincipal;
import com.vietninie.service.LessonService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LessonServiceImpl implements LessonService {

    private final LessonAttemptRepository repository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public void recordAttempt(String lessonId, LessonAttemptRequest r, UserPrincipal principal) {
        repository.save(LessonAttempt.builder()
                .user(userRepository.getReferenceById(principal.getId()))
                .lessonId(lessonId)
                .quizScore(r.quizScore())
                .quizTotal(r.quizTotal())
                .stepsCompleted(r.stepsCompleted())
                .completed(r.completed())
                .build());
    }
}
