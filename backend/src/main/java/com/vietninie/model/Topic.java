package com.vietninie.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "topics", uniqueConstraints = @UniqueConstraint(name = "uk_topic_key", columnNames = "topic_key"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Topic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "item_no", nullable = false)
    private Integer itemNo;

    @Column(name = "topic_key", nullable = false, length = 100)
    private String key;

    @Column(length = 300)
    private String vi;

    @Column(length = 300)
    private String zh;

    @Column(length = 20)
    private String level;

    @Column(length = 10)
    private String cefr;
}
