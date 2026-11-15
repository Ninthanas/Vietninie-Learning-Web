package com.vietninie.dto.response;

import java.util.List;

/** Mirrors the vocabulary JSON of the client; id == itemNo. Null fields are omitted. */
public record VocabularyResponse(
        Integer id,
        String word,
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
