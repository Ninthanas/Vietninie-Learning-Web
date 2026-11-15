package com.vietninie.service.impl;

import com.vietninie.dto.request.ProgressSyncRequest;
import com.vietninie.dto.request.QuizResultRequest;
import com.vietninie.dto.request.SrsRequest;
import com.vietninie.dto.response.ProgressResponse;
import com.vietninie.dto.response.ProgressSummaryResponse;
import com.vietninie.dto.response.SrsEntryResponse;
import com.vietninie.enums.Direction;
import com.vietninie.model.QuizResult;
import com.vietninie.model.UserVocabProgress;
import com.vietninie.repository.*;
import com.vietninie.service.ProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProgressServiceImpl implements ProgressService {

    private final UserVocabProgressRepository progressRepository;
    private final QuizResultRepository quizRepository;
    private final LessonAttemptRepository lessonRepository;
    private final PlacementResultRepository placementRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public ProgressResponse get(Long userId, Direction direction) {
        List<Integer> learned = new ArrayList<>();
        List<Integer> favorites = new ArrayList<>();
        Map<Integer, SrsEntryResponse> srs = new LinkedHashMap<>();
        for (UserVocabProgress p : progressRepository.findByUserIdAndDirection(userId, direction)) {
            if (p.isLearned()) {
                learned.add(p.getItemNo());
            }
            if (p.isFavorite()) {
                favorites.add(p.getItemNo());
            }
            if (p.getLastReviewed() != null || p.getSrsRating() != null) {
                srs.put(p.getItemNo(), new SrsEntryResponse(p.getSrsRating(), p.getSrsReps(),
                        p.getLastReviewed(), p.getNextReview()));
            }
        }
        return new ProgressResponse(learned, favorites, srs);
    }

    @Override
    @Transactional
    public void setLearned(Long userId, Direction direction, int itemNo, boolean value) {
        entry(userId, direction, itemNo).setLearned(value);
    }

    @Override
    @Transactional
    public void setFavorite(Long userId, Direction direction, int itemNo, boolean value) {
        entry(userId, direction, itemNo).setFavorite(value);
    }

    @Override
    @Transactional
    public void saveSrs(Long userId, Direction direction, int itemNo, SrsRequest srs) {
        applySrs(entry(userId, direction, itemNo), srs);
    }

    @Override
    @Transactional
    public ProgressResponse sync(Long userId, Direction direction, ProgressSyncRequest request) {
        if (request.learned() != null) {
            request.learned().forEach(id -> entry(userId, direction, id).setLearned(true));
        }
        if (request.favorites() != null) {
            request.favorites().forEach(id -> entry(userId, direction, id).setFavorite(true));
        }
        if (request.srs() != null) {
            request.srs().forEach((id, incoming) -> {
                UserVocabProgress p = entry(userId, direction, id);
                long current = p.getLastReviewed() == null ? 0 : p.getLastReviewed();
                long offered = incoming.lastReviewed() == null ? 0 : incoming.lastReviewed();
                if (offered >= current) {
                    applySrs(p, incoming);
                }
            });
        }
        progressRepository.flush();
        return get(userId, direction);
    }

    @Override
    @Transactional
    public void reset(Long userId, Direction direction) {
        progressRepository.deleteByUserIdAndDirection(userId, direction);
    }

    @Override
    @Transactional
    public void saveQuizResult(Long userId, Direction direction, QuizResultRequest r) {
        quizRepository.save(QuizResult.builder()
                .user(userRepository.getReferenceById(userId))
                .direction(direction)
                .mode(r.mode())
                .score(r.score())
                .total(r.total())
                .build());
    }

    @Override
    @Transactional(readOnly = true)
    public ProgressSummaryResponse summary(Long userId) {
        long sumTotal = quizRepository.sumTotal(userId);
        int avg = sumTotal == 0 ? 0 : (int) Math.round(quizRepository.sumScore(userId) * 100.0 / sumTotal);
        String placement = placementRepository.findFirstByUserIdOrderByCreatedAtDesc(userId)
                .map(r -> r.getRecommendedLevel()).orElse(null);
        return new ProgressSummaryResponse(
                progressRepository.countByUserIdAndDirectionAndLearnedTrue(userId, Direction.ZH),
                progressRepository.countByUserIdAndDirectionAndLearnedTrue(userId, Direction.VI),
                progressRepository.countByUserIdAndDirectionAndFavoriteTrue(userId, Direction.ZH),
                progressRepository.countByUserIdAndDirectionAndFavoriteTrue(userId, Direction.VI),
                quizRepository.countByUserId(userId),
                avg,
                lessonRepository.countByUserIdAndCompletedTrue(userId),
                placement);
    }

    private UserVocabProgress entry(Long userId, Direction direction, Integer itemNo) {
        return progressRepository.findByUserIdAndDirectionAndItemNo(userId, direction, itemNo)
                .orElseGet(() -> progressRepository.save(UserVocabProgress.builder()
                        .user(userRepository.getReferenceById(userId))
                        .direction(direction)
                        .itemNo(itemNo)
                        .build()));
    }

    private void applySrs(UserVocabProgress p, SrsRequest s) {
        p.setSrsRating(s.rating());
        p.setSrsReps(s.reps());
        p.setLastReviewed(s.lastReviewed());
        p.setNextReview(s.nextReview());
    }
}
