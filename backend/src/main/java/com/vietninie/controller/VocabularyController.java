package com.vietninie.controller;

import com.vietninie.dto.response.VocabularyResponse;
import com.vietninie.enums.Direction;
import com.vietninie.service.VocabularyService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vocabulary")
@RequiredArgsConstructor
public class VocabularyController {

    private final VocabularyService service;

    /** GET /api/vocabulary/zh?topic=greetings&level=HSK 1&q=你 */
    @GetMapping("/{direction}")
    public List<VocabularyResponse> list(@PathVariable String direction,
                                         @RequestParam(required = false) String topic,
                                         @RequestParam(required = false) String level,
                                         @RequestParam(required = false) String q) {
        return service.list(Direction.fromCode(direction), topic, level, q);
    }

    @GetMapping("/{direction}/{itemNo}")
    public VocabularyResponse get(@PathVariable String direction, @PathVariable int itemNo) {
        return service.get(Direction.fromCode(direction), itemNo);
    }
}
