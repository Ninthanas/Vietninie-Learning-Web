package com.vietninie.repository;

import com.vietninie.model.PlacementResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PlacementResultRepository extends JpaRepository<PlacementResult, Long> {
    Optional<PlacementResult> findFirstByUserIdOrderByCreatedAtDesc(Long userId);
}
