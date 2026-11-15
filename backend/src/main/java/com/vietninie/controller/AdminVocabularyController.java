package com.vietninie.controller;

import com.vietninie.dto.request.VocabularyRequest;
import com.vietninie.dto.response.VocabularyResponse;
import com.vietninie.enums.Direction;
import com.vietninie.service.VocabularyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/vocabulary")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminVocabularyController {

    private final VocabularyService service;

    @PostMapping("/{direction}")
    public ResponseEntity<VocabularyResponse> create(@PathVariable String direction,
                                                     @Valid @RequestBody VocabularyRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(Direction.fromCode(direction), request));
    }

    @PutMapping("/{direction}/{itemNo}")
    public VocabularyResponse update(@PathVariable String direction, @PathVariable int itemNo,
                                     @Valid @RequestBody VocabularyRequest request) {
        return service.update(Direction.fromCode(direction), itemNo, request);
    }

    @DeleteMapping("/{direction}/{itemNo}")
    public ResponseEntity<Void> delete(@PathVariable String direction, @PathVariable int itemNo) {
        service.delete(Direction.fromCode(direction), itemNo);
        return ResponseEntity.noContent().build();
    }
}
