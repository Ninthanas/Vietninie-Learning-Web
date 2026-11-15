package com.vietninie.service.impl;

import com.vietninie.dto.request.VocabularyRequest;
import com.vietninie.dto.response.VocabularyResponse;
import com.vietninie.enums.Direction;
import com.vietninie.exception.ResourceNotFoundException;
import com.vietninie.model.VocabularyItem;
import com.vietninie.repository.VocabularyRepository;
import com.vietninie.service.VocabularyService;
import com.vietninie.util.Mappers;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;
import java.util.function.Predicate;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class VocabularyServiceImpl implements VocabularyService {

    private final VocabularyRepository repository;

    @Override
    @Transactional(readOnly = true)
    public List<VocabularyResponse> list(Direction direction, String topic, String level, String q) {
        Stream<VocabularyItem> stream = repository.findByDirectionOrderByItemNoAsc(direction).stream();
        if (notBlank(topic)) {
            stream = stream.filter(v -> topic.equalsIgnoreCase(v.getTopic()) || topic.equalsIgnoreCase(v.getTopicKey()));
        }
        if (notBlank(level)) {
            stream = stream.filter(v -> level.equalsIgnoreCase(v.getLevel()) || level.equalsIgnoreCase(v.getCefr()));
        }
        if (notBlank(q)) {
            String needle = q.trim().toLowerCase(Locale.ROOT);
            Predicate<String> hit = s -> s != null && s.toLowerCase(Locale.ROOT).contains(needle);
            stream = stream.filter(v -> hit.test(v.getWord()) || hit.test(v.getPinyin()) || hit.test(v.getMeaningVi())
                    || hit.test(v.getMeaningZh()) || hit.test(v.getPronunciationGuide()));
        }
        return stream.map(Mappers::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public VocabularyResponse get(Direction direction, int itemNo) {
        return Mappers.toResponse(find(direction, itemNo));
    }

    @Override
    @Transactional
    public VocabularyResponse create(Direction direction, VocabularyRequest request) {
        VocabularyItem item = new VocabularyItem();
        item.setDirection(direction);
        item.setItemNo(repository.maxItemNo(direction) + 1);
        apply(item, request);
        return Mappers.toResponse(repository.save(item));
    }

    @Override
    @Transactional
    public VocabularyResponse update(Direction direction, int itemNo, VocabularyRequest request) {
        VocabularyItem item = find(direction, itemNo);
        apply(item, request);
        return Mappers.toResponse(repository.save(item));
    }

    @Override
    @Transactional
    public void delete(Direction direction, int itemNo) {
        repository.delete(find(direction, itemNo));
    }

    private VocabularyItem find(Direction direction, int itemNo) {
        return repository.findByDirectionAndItemNo(direction, itemNo)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy từ vựng #" + itemNo));
    }

    private void apply(VocabularyItem v, VocabularyRequest r) {
        v.setWord(r.word().trim());
        v.setPinyin(r.pinyin());
        v.setMeaningVi(r.meaningVi());
        v.setMeaningZh(r.meaningZh());
        v.setPronunciationGuide(r.pronunciationGuide());
        v.setWordType(r.wordType());
        v.setLevel(r.level());
        v.setCefr(r.cefr());
        v.setTopic(r.topic());
        v.setTopicKey(r.topicKey());
        v.setTopicLabelVi(r.topicLabelVi());
        v.setTopicLabelZh(r.topicLabelZh());
        v.setExampleZh(r.exampleZh());
        v.setExamplePinyin(r.examplePinyin());
        v.setExampleVi(r.exampleVi());
        v.setPronunciation(r.pronunciation());
        v.setUsageNote(r.usageNote());
        v.setTags(Mappers.joinTags(r.tags()));
    }

    private static boolean notBlank(String s) {
        return s != null && !s.isBlank();
    }
}
