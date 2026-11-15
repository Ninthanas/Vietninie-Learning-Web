package com.vietninie.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "lesson_attempts", indexes = @Index(name = "idx_attempt_user", columnList = "user_id"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "lesson_id", nullable = false, length = 100)
    private String lessonId;

    @Column(name = "quiz_score")
    private int quizScore;

    @Column(name = "quiz_total")
    private int quizTotal;

    @Column(name = "steps_completed")
    private int stepsCompleted;

    private boolean completed;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @PrePersist
    void onCreate() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }
}
