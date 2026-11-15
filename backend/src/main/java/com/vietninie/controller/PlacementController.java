package com.vietninie.controller;

import com.vietninie.dto.request.PlacementSubmitRequest;
import com.vietninie.dto.response.PlacementQuestionResponse;
import com.vietninie.dto.response.PlacementResultResponse;
import com.vietninie.security.UserPrincipal;
import com.vietninie.service.PlacementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/placement")
@RequiredArgsConstructor
public class PlacementController {

    private final PlacementService service;

    /** Client expects {"questions": [...]}. */
    @GetMapping("/questions")
    public Map<String, List<PlacementQuestionResponse>> questions() {
        return Map.of("questions", service.questions());
    }

    @PostMapping("/submit")
    public PlacementResultResponse submit(@Valid @RequestBody PlacementSubmitRequest request,
                                          @AuthenticationPrincipal UserPrincipal principal) {
        return service.submit(request, principal);
    }
}
