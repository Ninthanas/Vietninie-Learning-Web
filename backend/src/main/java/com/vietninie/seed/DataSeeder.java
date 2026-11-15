package com.vietninie.seed;

import com.fasterxml.jackson.databind.JsonNode;
import com.vietninie.enums.Direction;
import com.vietninie.enums.Role;
import com.vietninie.model.*;
import com.vietninie.repository.*;
import com.vietninie.util.JsonUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import static com.vietninie.util.JsonUtil.text;

/** Loads the JSON datasets in src/main/resources/seed into empty tables and creates the admin account. */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements ApplicationRunner {

    private final VocabularyRepository vocabularyRepository;
    private final GrammarRepository grammarRepository;
    private final ConversationRepository conversationRepository;
    private final TopicRepository topicRepository;
    private final PlacementQuestionRepository placementRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.seed.enabled:true}")
    private boolean enabled;
    @Value("${app.admin.username}")
    private String adminUsername;
    @Value("${app.admin.password}")
    private String adminPassword;
    @Value("${app.admin.display-name}")
    private String adminDisplayName;

    @Override
    @Transactional
    public void run(ApplicationArguments args) throws IOException {
        seedAdmin();
        if (!enabled) {
            return;
        }
        seedVocabulary(Direction.ZH, "seed/chinese-vocabulary.json");
        seedVocabulary(Direction.VI, "seed/vietnamese-vocabulary.json");
        seedGrammar(Direction.ZH, "seed/chinese-grammar.json");
        seedGrammar(Direction.VI, "seed/vietnamese-grammar.json");
        seedConversations();
        seedTopics();
        seedPlacement();
    }

    private void seedAdmin() {
        if (!userRepository.existsByUsernameIgnoreCase(adminUsername)) {
            userRepository.save(User.builder()
                    .username(adminUsername)
                    .passwordHash(passwordEncoder.encode(adminPassword))
                    .displayName(adminDisplayName)
                    .role(Role.ADMIN)
                    .build());
            log.info("Created admin account '{}'", adminUsername);
        }
    }

    private void seedVocabulary(Direction dir, String file) throws IOException {
        if (vocabularyRepository.countByDirection(dir) > 0) {
            return;
        }
        List<VocabularyItem> items = new ArrayList<>();
        for (JsonNode n : read(file)) {
            items.add(VocabularyItem.builder()
                    .direction(dir)
                    .itemNo(n.get("id").asInt())
                    .word(text(n, "word"))
                    .pinyin(text(n, "pinyin"))
                    .meaningVi(text(n, "meaning_vi"))
                    .meaningZh(text(n, "meaning_zh"))
                    .pronunciationGuide(text(n, "pronunciation_guide"))
                    .wordType(text(n, "word_type"))
                    .level(text(n, "level"))
                    .cefr(text(n, "cefr"))
                    .topic(text(n, "topic"))
                    .topicKey(text(n, "topic_key"))
                    .topicLabelVi(text(n, "topic_label_vi"))
                    .topicLabelZh(text(n, "topic_label_zh"))
                    .exampleZh(text(n, "example_zh"))
                    .examplePinyin(text(n, "example_pinyin"))
                    .exampleVi(text(n, "example_vi"))
                    .pronunciation(text(n, "pronunciation"))
                    .usageNote(text(n, "usage_note"))
                    .tags(tags(n.get("tags")))
                    .build());
        }
        vocabularyRepository.saveAll(items);
        log.info("Seeded {} {} vocabulary items", items.size(), dir);
    }

    private void seedGrammar(Direction dir, String file) throws IOException {
        if (grammarRepository.countByDirection(dir) > 0) {
            return;
        }
        List<GrammarLesson> items = new ArrayList<>();
        for (JsonNode n : read(file)) {
            items.add(GrammarLesson.builder()
                    .direction(dir)
                    .itemNo(n.get("id").asInt())
                    .title(text(n, "title"))
                    .pattern(text(n, "pattern"))
                    .level(text(n, "level"))
                    .explanation(text(n, "explanation"))
                    .exercisePrompt(text(n, "exercise_prompt"))
                    .examplesJson(n.has("examples") ? n.get("examples").toString() : null)
                    .quizJson(n.has("quiz") ? n.get("quiz").toString() : null)
                    .build());
        }
        grammarRepository.saveAll(items);
        log.info("Seeded {} {} grammar lessons", items.size(), dir);
    }

    private void seedConversations() throws IOException {
        if (conversationRepository.count() > 0) {
            return;
        }
        List<Conversation> items = new ArrayList<>();
        for (JsonNode n : read("seed/conversations.json")) {
            items.add(Conversation.builder()
                    .itemNo(n.get("id").asInt())
                    .slug(text(n, "slug"))
                    .titleVi(text(n, "title_vi"))
                    .titleZh(text(n, "title_zh"))
                    .level(text(n, "level"))
                    .scenarioVi(text(n, "scenario_vi"))
                    .scenarioZh(text(n, "scenario_zh"))
                    .linesJson(n.has("lines") ? n.get("lines").toString() : "[]")
                    .build());
        }
        conversationRepository.saveAll(items);
        log.info("Seeded {} conversations", items.size());
    }

    private void seedTopics() throws IOException {
        if (topicRepository.count() > 0) {
            return;
        }
        List<Topic> items = new ArrayList<>();
        for (JsonNode n : read("seed/topics.json")) {
            items.add(Topic.builder()
                    .itemNo(n.get("id").asInt())
                    .key(text(n, "key"))
                    .vi(text(n, "vi"))
                    .zh(text(n, "zh"))
                    .level(text(n, "level"))
                    .cefr(text(n, "cefr"))
                    .build());
        }
        topicRepository.saveAll(items);
        log.info("Seeded {} topics", items.size());
    }

    private void seedPlacement() throws IOException {
        if (placementRepository.count() > 0) {
            return;
        }
        List<PlacementQuestion> items = new ArrayList<>();
        for (JsonNode n : read("seed/placement-questions.json")) {
            items.add(PlacementQuestion.builder()
                    .questionId(text(n, "id"))
                    .level(text(n, "level"))
                    .questionText(text(n, "question_zh"))
                    .optionsJson(n.get("options").toString())
                    .correctIndex(n.get("correct_index").asInt())
                    .build());
        }
        placementRepository.saveAll(items);
        log.info("Seeded {} placement questions", items.size());
    }

    private static JsonNode read(String path) throws IOException {
        try (InputStream in = new ClassPathResource(path).getInputStream()) {
            return JsonUtil.MAPPER.readTree(in);
        }
    }

    private static String tags(JsonNode node) {
        if (node == null || !node.isArray() || node.isEmpty()) {
            return null;
        }
        List<String> out = new ArrayList<>();
        node.forEach(t -> out.add(t.asText()));
        return String.join(",", out);
    }
}
