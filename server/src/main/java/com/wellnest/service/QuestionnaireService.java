package com.wellnest.service;

import java.time.Instant;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.wellnest.dto.QuestionnaireDtos.QuestionnaireRequest;
import com.wellnest.model.QuestionnaireResult;
import com.wellnest.repository.QuestionnaireResultRepository;

@Service
public class QuestionnaireService {
    private final QuestionnaireResultRepository questionnaireResultRepository;

    public QuestionnaireService(QuestionnaireResultRepository questionnaireResultRepository) {
        this.questionnaireResultRepository = questionnaireResultRepository;
    }

    public QuestionnaireResult submit(String userId, QuestionnaireRequest request) {
        QuestionnaireResult result = new QuestionnaireResult();
        result.setUserId(userId);
        result.setStress(request.stress());
        result.setSleep(request.sleep());
        result.setMood(request.mood());
        result.setEnergy(request.energy());
        result.setScore(calculateScore(request));
        result.setCreatedAt(Instant.now());
        return questionnaireResultRepository.save(result);
    }

    public Optional<QuestionnaireResult> latest(String userId) {
        return questionnaireResultRepository.findTopByUserIdOrderByCreatedAtDesc(userId);
    }

    private int calculateScore(QuestionnaireRequest request) {
        int stressComponent = 6 - request.stress();
        int total = stressComponent + request.sleep() + request.mood() + request.energy();
        return Math.round((total / 20.0f) * 100);
    }
}
