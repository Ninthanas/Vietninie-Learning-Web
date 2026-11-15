package com.vietninie.service.impl;

import com.vietninie.dto.response.GrammarResponse;
import com.vietninie.enums.Direction;
import com.vietninie.repository.GrammarRepository;
import com.vietninie.service.GrammarService;
import com.vietninie.util.Mappers;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GrammarServiceImpl implements GrammarService {

    private final GrammarRepository repository;

    @Override
    @Transactional(readOnly = true)
    public List<GrammarResponse> list(Direction direction) {
        return repository.findByDirectionOrderByItemNoAsc(direction).stream().map(Mappers::toResponse).toList();
    }
}
