package com.wellnest.repository;

import java.util.Optional;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.wellnest.model.QuestionnaireResult;

public interface QuestionnaireResultRepository extends MongoRepository<QuestionnaireResult, String> {
    Optional<QuestionnaireResult> findTopByUserIdOrderByCreatedAtDesc(String userId);
    List<QuestionnaireResult> findByUserIdOrderByCreatedAtDesc(String userId, Pageable pageable);
}
