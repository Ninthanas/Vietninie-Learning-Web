package com.vietninie.controller;

import com.vietninie.dto.response.GrammarResponse;
import com.vietninie.enums.Direction;
import com.vietninie.service.GrammarService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grammar")
@RequiredArgsConstructor
public class GrammarController {

    private final GrammarService service;

    @GetMapping("/{direction}")
    public List<GrammarResponse> list(@PathVariable String direction) {
        return service.list(Direction.fromCode(direction));
    }
}
