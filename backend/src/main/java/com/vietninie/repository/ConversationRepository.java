package com.vietninie.repository;

import com.vietninie.model.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    List<Conversation> findAllByOrderByItemNoAsc();

    Optional<Conversation> findBySlug(String slug);
}
