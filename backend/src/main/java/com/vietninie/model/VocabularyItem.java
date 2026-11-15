package com.vietninie.model;

import com.vietninie.enums.Direction;
import jakarta.persistence.*;
import lombok.*;

/**
 * One row for both directions. ZH rows use pinyin / meaningVi; VI rows use pronunciationGuide / meaningZh.
 * itemNo is the id the client knows (it overlaps between directions: zh 1..889, vi 1..795).
 */
@Entity
@Table(name = "vocabulary_items",
        uniqueConstraints = @UniqueConstraint(name = "uk_vocab_dir_no", columnNames = {"direction", "item_no"}),
        indexes = {@Index(name = "idx_vocab_topic", columnList = "direction, topic"),
                @Index(name = "idx_vocab_level", columnList = "direction, level")})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VocabularyItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 4)
    private Direction direction;

    @Column(name = "item_no", nullable = false)
    private Integer itemNo;

    @Column(nullable = false, length = 200)
    private String word;

    @Column(length = 200)
    private String pinyin;

    @Column(name = "meaning_vi", columnDefinition = "TEXT")
    private String meaningVi;

    @Column(name = "meaning_zh", columnDefinition = "TEXT")
    private String meaningZh;

    @Column(name = "pronunciation_guide", length = 300)
    private String pronunciationGuide;

    @Column(name = "word_type", length = 50)
    private String wordType;

    @Column(length = 20)
    private String level;

    @Column(length = 10)
    private String cefr;

    @Column(length = 100)
    private String topic;

    @Column(name = "topic_key", length = 100)
    private String topicKey;

    @Column(name = "topic_label_vi", length = 200)
    private String topicLabelVi;

    @Column(name = "topic_label_zh", length = 200)
    private String topicLabelZh;

    @Column(name = "example_zh", columnDefinition = "TEXT")
    private String exampleZh;

    @Column(name = "example_pinyin", columnDefinition = "TEXT")
    private String examplePinyin;

    @Column(name = "example_vi", columnDefinition = "TEXT")
    private String exampleVi;

    @Column(columnDefinition = "TEXT")
    private String pronunciation;

    /** Trusted, hand-authored HTML snippet rendered by the client. */
    @Column(name = "usage_note", columnDefinition = "TEXT")
    private String usageNote;

    /** Comma separated tags. */
    @Column(columnDefinition = "TEXT")
    private String tags;
}
