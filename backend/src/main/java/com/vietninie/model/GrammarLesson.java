package com.vietninie.model;

import com.vietninie.enums.Direction;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "grammar_lessons",
        uniqueConstraints = @UniqueConstraint(name = "uk_grammar_dir_no", columnNames = {"direction", "item_no"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GrammarLesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 4)
    private Direction direction;

    @Column(name = "item_no", nullable = false)
    private Integer itemNo;

    @Column(nullable = false, length = 300)
    private String title;

    @Column(length = 500)
    private String pattern;

    @Column(length = 20)
    private String level;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @Column(name = "exercise_prompt", length = 1000)
    private String exercisePrompt;

    /** JSON array: [{zh|vi, pinyin, ...}] */
    @Column(name = "examples_json", columnDefinition = "TEXT")
    private String examplesJson;

    /** JSON object: {question, options[], answerIndex, explanation} */
    @Column(name = "quiz_json", columnDefinition = "TEXT")
    private String quizJson;
}
