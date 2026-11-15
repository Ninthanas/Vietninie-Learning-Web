package com.vietninie.controller;

import com.vietninie.dto.response.ConversationResponse;
import com.vietninie.service.ConversationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/conversations")
@RequiredArgsConstructor
public class ConversationController {

    private final ConversationService service;

    @GetMapping
    public List<ConversationResponse> list() {
        return service.list();
    }

    @GetMapping("/{slug}")
    public ConversationResponse get(@PathVariable String slug) {
        return service.getBySlug(slug);
    }
}
