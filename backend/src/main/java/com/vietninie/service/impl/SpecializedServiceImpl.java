package com.vietninie.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.vietninie.service.SpecializedService;
import com.vietninie.util.JsonUtil;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;

@Service
public class SpecializedServiceImpl implements SpecializedService {

    private volatile JsonNode cache;

    @Override
    public JsonNode get() {
        JsonNode local = cache;
        if (local == null) {
            try (InputStream in = new ClassPathResource("seed/specialized-vocabulary.json").getInputStream()) {
                local = JsonUtil.MAPPER.readTree(in);
                cache = local;
            } catch (IOException e) {
                throw new IllegalStateException("Cannot read specialized vocabulary", e);
            }
        }
        return local;
    }
}
