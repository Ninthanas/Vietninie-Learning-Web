package com.vietninie.util;

import com.vietninie.dto.response.*;
import com.vietninie.model.*;

import java.util.Arrays;
import java.util.List;

/** Entity -> response DTO conversions. */
public final class Mappers {

    private Mappers() {
    }

    public static VocabularyResponse toResponse(VocabularyItem v) {
        return new VocabularyResponse(
                v.getItemNo(), v.getWord(), v.getPinyin(), v.getMeaningVi(), v.getMeaningZh(),
                v.getPronunciationGuide(), v.getWordType(), v.getLevel(), v.getCefr(), v.getTopic(),
                v.getTopicKey(), v.getTopicLabelVi(), v.getTopicLabelZh(), v.getExampleZh(),
                v.getExamplePinyin(), v.getExampleVi(), v.getPronunciation(), v.getUsageNote(),
                splitTags(v.getTags()));
    }

    public static GrammarResponse toResponse(GrammarLesson g) {
        return new GrammarResponse(g.getItemNo(), g.getTitle(), g.getPattern(), g.getLevel(), g.getExplanation(),
                g.getExercisePrompt(), JsonUtil.read(g.getExamplesJson()), JsonUtil.read(g.getQuizJson()));
    }

    public static ConversationResponse toResponse(Conversation c) {
        return new ConversationResponse(c.getItemNo(), c.getSlug(), c.getTitleVi(), c.getTitleZh(), c.getLevel(),
                c.getScenarioVi(), c.getScenarioZh(), JsonUtil.read(c.getLinesJson()));
    }

    public static TopicResponse toResponse(Topic t) {
        return new TopicResponse(t.getItemNo(), t.getKey(), t.getVi(), t.getZh(), t.getLevel(), t.getCefr());
    }

    public static String joinTags(List<String> tags) {
        return tags == null || tags.isEmpty() ? null : String.join(",", tags);
    }

    public static List<String> splitTags(String tags) {
        if (tags == null || tags.isBlank()) {
            return List.of();
        }
        return Arrays.stream(tags.split(",")).map(String::trim).filter(s -> !s.isEmpty()).toList();
    }
}
