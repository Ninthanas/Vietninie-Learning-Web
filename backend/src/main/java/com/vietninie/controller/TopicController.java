package com.vietninie.controller;

import com.vietninie.dto.response.TopicResponse;
import com.vietninie.service.TopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/topics")
@RequiredArgsConstructor
public class TopicController {

    private final TopicService service;

    @GetMapping
    public List<TopicResponse> list() {
        return service.list();
    }
}
