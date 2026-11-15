package com.vietninie.repository;

import com.vietninie.enums.Direction;
import com.vietninie.model.VocabularyItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface VocabularyRepository extends JpaRepository<VocabularyItem, Long> {

    List<VocabularyItem> findByDirectionOrderByItemNoAsc(Direction direction);

    Optional<VocabularyItem> findByDirectionAndItemNo(Direction direction, Integer itemNo);

    long countByDirection(Direction direction);

    @Query("select coalesce(max(v.itemNo), 0) from VocabularyItem v where v.direction = :direction")
    int maxItemNo(@Param("direction") Direction direction);
}
