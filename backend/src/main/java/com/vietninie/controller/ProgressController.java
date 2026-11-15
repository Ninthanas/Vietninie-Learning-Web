package com.vietninie.controller;

import com.vietninie.dto.request.*;
import com.vietninie.dto.response.ProgressResponse;
import com.vietninie.dto.response.ProgressSummaryResponse;
import com.vietninie.enums.Direction;
import com.vietninie.security.UserPrincipal;
import com.vietninie.service.ProgressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/** Everything here needs a valid JWT; ids are the client's vocabulary ids (itemNo). */
@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class ProgressController {

    private final ProgressService service;

    @GetMapping("/summary")
    public ProgressSummaryResponse summary(@AuthenticationPrincipal UserPrincipal me) {
        return service.summary(me.getId());
    }

    @GetMapping("/{direction}")
    public ProgressResponse get(@PathVariable String direction, @AuthenticationPrincipal UserPrincipal me) {
        return service.get(me.getId(), Direction.fromCode(direction));
    }

    @PostMapping("/{direction}/sync")
    public ProgressResponse sync(@PathVariable String direction, @RequestBody ProgressSyncRequest request,
                                 @AuthenticationPrincipal UserPrincipal me) {
        return service.sync(me.getId(), Direction.fromCode(direction), request);
    }

    @DeleteMapping("/{direction}")
    public ResponseEntity<Void> reset(@PathVariable String direction, @AuthenticationPrincipal UserPrincipal me) {
        service.reset(me.getId(), Direction.fromCode(direction));
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{direction}/learned/{itemNo}")
    public ResponseEntity<Void> learned(@PathVariable String direction, @PathVariable int itemNo,
                                        @RequestBody FlagRequest body, @AuthenticationPrincipal UserPrincipal me) {
        service.setLearned(me.getId(), Direction.fromCode(direction), itemNo, body.value());
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{direction}/favorite/{itemNo}")
    public ResponseEntity<Void> favorite(@PathVariable String direction, @PathVariable int itemNo,
                                         @RequestBody FlagRequest body, @AuthenticationPrincipal UserPrincipal me) {
        service.setFavorite(me.getId(), Direction.fromCode(direction), itemNo, body.value());
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{direction}/srs/{itemNo}")
    public ResponseEntity<Void> srs(@PathVariable String direction, @PathVariable int itemNo,
                                    @RequestBody SrsRequest body, @AuthenticationPrincipal UserPrincipal me) {
        service.saveSrs(me.getId(), Direction.fromCode(direction), itemNo, body);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{direction}/quiz")
    public ResponseEntity<Void> quiz(@PathVariable String direction, @Valid @RequestBody QuizResultRequest body,
                                     @AuthenticationPrincipal UserPrincipal me) {
        service.saveQuizResult(me.getId(), Direction.fromCode(direction), body);
        return ResponseEntity.noContent().build();
    }
}
