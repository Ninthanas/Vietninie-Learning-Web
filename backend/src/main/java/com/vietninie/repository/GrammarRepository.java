package com.vietninie.repository;

import com.vietninie.enums.Direction;
import com.vietninie.model.GrammarLesson;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GrammarRepository extends JpaRepository<GrammarLesson, Long> {
    List<GrammarLesson> findByDirectionOrderByItemNoAsc(Direction direction);

    long countByDirection(Direction direction);
}
