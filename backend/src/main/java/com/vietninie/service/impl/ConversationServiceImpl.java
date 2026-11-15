package com.vietninie.service.impl;

import com.vietninie.dto.response.ConversationResponse;
import com.vietninie.exception.ResourceNotFoundException;
import com.vietninie.repository.ConversationRepository;
import com.vietninie.service.ConversationService;
import com.vietninie.util.Mappers;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ConversationServiceImpl implements ConversationService {

    private final ConversationRepository repository;

    @Override
    @Transactional(readOnly = true)
    public List<ConversationResponse> list() {
        return repository.findAllByOrderByItemNoAsc().stream().map(Mappers::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ConversationResponse getBySlug(String slug) {
        return repository.findBySlug(slug).map(Mappers::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy hội thoại"));
    }
}
