package com.vietninie.repository;

import com.vietninie.enums.Direction;
import com.vietninie.model.UserVocabProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserVocabProgressRepository extends JpaRepository<UserVocabProgress, Long> {

    List<UserVocabProgress> findByUserIdAndDirection(Long userId, Direction direction);

    Optional<UserVocabProgress> findByUserIdAndDirectionAndItemNo(Long userId, Direction direction, Integer itemNo);

    long countByUserIdAndDirectionAndLearnedTrue(Long userId, Direction direction);

    long countByUserIdAndDirectionAndFavoriteTrue(Long userId, Direction direction);

    void deleteByUserIdAndDirection(Long userId, Direction direction);
}
