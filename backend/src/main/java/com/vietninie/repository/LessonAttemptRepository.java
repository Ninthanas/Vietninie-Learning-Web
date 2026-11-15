package com.vietninie.repository;

import com.vietninie.model.LessonAttempt;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LessonAttemptRepository extends JpaRepository<LessonAttempt, Long> {
    List<LessonAttempt> findByUserIdOrderByCreatedAtDesc(Long userId);

    long countByUserIdAndCompletedTrue(Long userId);
}
