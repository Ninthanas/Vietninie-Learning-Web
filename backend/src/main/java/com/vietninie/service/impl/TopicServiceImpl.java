package com.vietninie.service.impl;

import com.vietninie.dto.response.TopicResponse;
import com.vietninie.repository.TopicRepository;
import com.vietninie.service.TopicService;
import com.vietninie.util.Mappers;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TopicServiceImpl implements TopicService {

    private final TopicRepository repository;

    @Override
    @Transactional(readOnly = true)
    public List<TopicResponse> list() {
        return repository.findAllByOrderByItemNoAsc().stream().map(Mappers::toResponse).toList();
    }
}
