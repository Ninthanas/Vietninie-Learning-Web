package com.vietninie.service;

import com.vietninie.dto.response.GrammarResponse;
import com.vietninie.enums.Direction;

import java.util.List;

public interface GrammarService {
    List<GrammarResponse> list(Direction direction);
}
