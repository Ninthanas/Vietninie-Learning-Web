package com.vietninie.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "placement_questions",
        uniqueConstraints = @UniqueConstraint(name = "uk_placement_qid", columnNames = "question_id"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlacementQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Public id used by the client, e.g. pq_a1_1 */
    @Column(name = "question_id", nullable = false, length = 50)
    private String questionId;

    @Column(nullable = false, length = 4)
    private String level;

    @Column(name = "question_text", nullable = false, length = 1000)
    private String questionText;

    /** JSON array of option strings. */
    @Column(name = "options_json", nullable = false, columnDefinition = "TEXT")
    private String optionsJson;

    @Column(name = "correct_index", nullable = false)
    private Integer correctIndex;
}
