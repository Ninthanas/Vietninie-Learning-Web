package com.vietninie;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
class VietninieApplicationTests {

    @Autowired
    MockMvc mvc;

    @Test
    void publicVocabularyIsServed() throws Exception {
        mvc.perform(get("/api/vocabulary/zh"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].meaning_vi").exists());
    }

    @Test
    void registerLoginAndMe() throws Exception {
        mvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"tester\",\"password\":\"secret1\",\"display_name\":\"Tester\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.access_token").exists());
        mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"tester\",\"password\":\"wrong\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.detail").exists());
    }

    @Test
    void progressNeedsToken() throws Exception {
        mvc.perform(get("/api/progress/zh")).andExpect(status().isUnauthorized());
    }
}
