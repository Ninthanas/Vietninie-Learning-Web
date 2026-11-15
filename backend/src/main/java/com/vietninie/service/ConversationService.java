package com.vietninie.service;

import com.vietninie.dto.response.ConversationResponse;

import java.util.List;

public interface ConversationService {
    List<ConversationResponse> list();

    ConversationResponse getBySlug(String slug);
}
