package com.vietninie.controller;

import com.vietninie.dto.request.LessonAttemptRequest;
import com.vietninie.security.UserPrincipal;
import com.vietninie.service.LessonService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/lessons")
@RequiredArgsConstructor
public class LessonController {

    private final LessonService service;

    @PostMapping("/{lessonId}/attempt")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, String> attempt(@PathVariable String lessonId,
                                       @Valid @RequestBody LessonAttemptRequest request,
                                       @AuthenticationPrincipal UserPrincipal principal) {
        service.recordAttempt(lessonId, request, principal);
        return Map.of("status", "ok");
    }
}
