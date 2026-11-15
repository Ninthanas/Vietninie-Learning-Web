package com.vietninie.repository;

import com.vietninie.model.QuizResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface QuizResultRepository extends JpaRepository<QuizResult, Long> {

    List<QuizResult> findTop20ByUserIdOrderByCreatedAtDesc(Long userId);

    long countByUserId(Long userId);

    @Query("select coalesce(sum(q.score), 0) from QuizResult q where q.user.id = :userId")
    long sumScore(@Param("userId") Long userId);

    @Query("select coalesce(sum(q.total), 0) from QuizResult q where q.user.id = :userId")
    long sumTotal(@Param("userId") Long userId);
}
