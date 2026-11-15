package com.vietninie.repository;

import com.vietninie.model.PlacementQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlacementQuestionRepository extends JpaRepository<PlacementQuestion, Long> {
    List<PlacementQuestion> findAllByOrderByIdAsc();
}
