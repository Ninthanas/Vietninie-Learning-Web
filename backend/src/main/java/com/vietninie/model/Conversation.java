package com.vietninie.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "conversations",
        uniqueConstraints = @UniqueConstraint(name = "uk_conversation_slug", columnNames = "slug"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "item_no", nullable = false)
    private Integer itemNo;

    @Column(nullable = false, length = 150)
    private String slug;

    @Column(name = "title_vi", length = 300)
    private String titleVi;

    @Column(name = "title_zh", length = 300)
    private String titleZh;

    @Column(length = 20)
    private String level;

    @Column(name = "scenario_vi", length = 1000)
    private String scenarioVi;

    @Column(name = "scenario_zh", length = 1000)
    private String scenarioZh;

    /** JSON array: [{speaker, name, zh, vi, pinyin}] */
    @Column(name = "lines_json", columnDefinition = "TEXT")
    private String linesJson;
}
