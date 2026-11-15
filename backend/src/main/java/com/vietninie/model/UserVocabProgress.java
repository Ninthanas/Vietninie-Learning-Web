package com.vietninie.model;

import com.vietninie.enums.Direction;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

/** Per-user learning state of one vocabulary item (learned / favorite / spaced repetition). */
@Entity
@Table(name = "user_vocab_progress",
        uniqueConstraints = @UniqueConstraint(name = "uk_progress_user_dir_item", columnNames = {"user_id", "direction", "item_no"}),
        indexes = @Index(name = "idx_progress_user_dir", columnList = "user_id, direction"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserVocabProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 4)
    private Direction direction;

    @Column(name = "item_no", nullable = false)
    private Integer itemNo;

    @Column(nullable = false)
    private boolean learned;

    @Column(nullable = false)
    private boolean favorite;

    /** Client rating 1..4 (5 min / 1 day / 3 days / 7 days). */
    @Column(name = "srs_rating")
    private Integer srsRating;

    @Column(name = "srs_reps")
    private Integer srsReps;

    @Column(name = "last_reviewed")
    private Long lastReviewed;

    @Column(name = "next_review")
    private Long nextReview;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @PrePersist
    @PreUpdate
    void touch() {
        updatedAt = Instant.now();
    }
}
