package com.vietninie.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.vietninie.service.SpecializedService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/specialized")
@RequiredArgsConstructor
public class SpecializedController {

    private final SpecializedService service;

    @GetMapping
    public JsonNode get() {
        return service.get();
    }
}
