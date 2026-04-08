package com.wellnest.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.wellnest.dto.QuestionnaireDtos.QuestionnaireRequest;
import com.wellnest.service.CurrentUserService;
import com.wellnest.service.QuestionnaireService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/questionnaire")
@Validated
public class QuestionnaireController {
    private final QuestionnaireService questionnaireService;
    private final CurrentUserService currentUserService;

    public QuestionnaireController(QuestionnaireService questionnaireService, CurrentUserService currentUserService) {
        this.questionnaireService = questionnaireService;
        this.currentUserService = currentUserService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> submit(Authentication authentication, @Valid @RequestBody QuestionnaireRequest request) {
        String userId = currentUserService.currentUserId(authentication);
        var result = questionnaireService.submit(userId, request);
        return Map.of("id", result.getId(), "score", result.getScore(), "createdAt", result.getCreatedAt());
    }

    @GetMapping("/latest")
    public Map<String, Object> latest(Authentication authentication) {
        String userId = currentUserService.currentUserId(authentication);
        return questionnaireService.latest(userId)
                .<Map<String, Object>>map(result -> Map.of(
                        "id", result.getId(),
                        "score", result.getScore(),
                        "createdAt", result.getCreatedAt()
                ))
                .orElse(Map.of());
    }
}
