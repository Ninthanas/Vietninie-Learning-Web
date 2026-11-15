package com.vietninie.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.vietninie.dto.request.PlacementSubmitRequest;
import com.vietninie.dto.response.PlacementQuestionResponse;
import com.vietninie.dto.response.PlacementResultResponse;
import com.vietninie.dto.response.PlacementResultResponse.LevelScore;
import com.vietninie.enums.CefrLevel;
import com.vietninie.model.PlacementQuestion;
import com.vietninie.model.PlacementResult;
import com.vietninie.repository.PlacementQuestionRepository;
import com.vietninie.repository.PlacementResultRepository;
import com.vietninie.repository.UserRepository;
import com.vietninie.security.UserPrincipal;
import com.vietninie.service.PlacementService;
import com.vietninie.util.JsonUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PlacementServiceImpl implements PlacementService {

    private static final int PASS_PERCENT = 60;

    private final PlacementQuestionRepository questionRepository;
    private final PlacementResultRepository resultRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<PlacementQuestionResponse> questions() {
        return questionRepository.findAllByOrderByIdAsc().stream()
                .map(q -> new PlacementQuestionResponse(q.getQuestionId(), q.getLevel(), q.getQuestionText(), options(q)))
                .toList();
    }

    @Override
    @Transactional
    public PlacementResultResponse submit(PlacementSubmitRequest request, UserPrincipal principal) {
        Map<String, Integer> given = new HashMap<>();
        request.answers().forEach(a -> given.put(a.questionId(), a.selectedIndex()));

        Map<CefrLevel, int[]> counts = new EnumMap<>(CefrLevel.class); // [correct, total]
        CefrLevel.ORDERED.forEach(l -> counts.put(l, new int[2]));

        List<PlacementQuestion> all = questionRepository.findAllByOrderByIdAsc();
        int totalCorrect = 0;
        for (PlacementQuestion q : all) {
            int[] c = counts.get(CefrLevel.parse(q.getLevel()));
            c[1]++;
            Integer chosen = given.get(q.getQuestionId());
            if (chosen != null && chosen.equals(q.getCorrectIndex())) {
                c[0]++;
                totalCorrect++;
            }
        }

        CefrLevel recommended = CefrLevel.A1;
        List<LevelScore> scores = new ArrayList<>();
        for (CefrLevel level : CefrLevel.ORDERED) {
            int[] c = counts.get(level);
            int pct = (int) Math.round(c[0] * 100.0 / Math.max(1, c[1]));
            if (pct >= PASS_PERCENT) {
                recommended = level;
            }
            scores.add(new LevelScore(level.name(), c[0], c[1], pct));
        }

        if (principal != null) {
            resultRepository.save(PlacementResult.builder()
                    .user(userRepository.getReferenceById(principal.getId()))
                    .recommendedLevel(recommended.name())
                    .totalCorrect(totalCorrect)
                    .totalQuestions(all.size())
                    .build());
        }
        return new PlacementResultResponse(recommended.name(), scores, totalCorrect, all.size());
    }

    private List<String> options(PlacementQuestion q) {
        return JsonUtil.MAPPER.convertValue(JsonUtil.read(q.getOptionsJson()), new TypeReference<List<String>>() {
        });
    }
}
