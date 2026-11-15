package com.vietninie.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

/** Admin create / update payload (fields follow the public vocabulary JSON). */
public record VocabularyRequest(
        @NotBlank(message = "Thiếu từ vựng") @Size(max = 200) String word,
        String pinyin,
        String meaningVi,
        String meaningZh,
        String pronunciationGuide,
        String wordType,
        String level,
        String cefr,
        String topic,
        String topicKey,
        String topicLabelVi,
        String topicLabelZh,
        String exampleZh,
        String examplePinyin,
        String exampleVi,
        String pronunciation,
        String usageNote,
        List<String> tags) {
}
