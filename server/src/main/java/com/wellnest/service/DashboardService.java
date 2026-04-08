package com.wellnest.service;

import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.wellnest.repository.QuestionnaireResultRepository;
import com.wellnest.repository.NoteRepository;

@Service
public class DashboardService {
    private final NoteRepository noteRepository;
    private final QuestionnaireService questionnaireService;
    private final QuestionnaireResultRepository questionnaireResultRepository;

    public DashboardService(NoteRepository noteRepository, QuestionnaireService questionnaireService,
                            QuestionnaireResultRepository questionnaireResultRepository) {
        this.noteRepository = noteRepository;
        this.questionnaireService = questionnaireService;
        this.questionnaireResultRepository = questionnaireResultRepository;
    }

    public Map<String, Object> stats(String userId) {
        long notesCount = noteRepository.countByUserId(userId);
        Integer wellnessScore = questionnaireService.latest(userId).map(r -> r.getScore()).orElse(null);
        return Map.of(
                "notesCount", notesCount,
                "wellnessScore", wellnessScore == null ? -1 : wellnessScore
        );
    }

    public Map<String, Object> history(String userId) {
        var latestResults = questionnaireResultRepository.findByUserIdOrderByCreatedAtDesc(userId, PageRequest.of(0, 7));
        var trend = latestResults.stream()
                .sorted(Comparator.comparing(r -> r.getCreatedAt()))
                .map(r -> Map.of(
                        "day", r.getCreatedAt().atZone(ZoneOffset.UTC).format(DateTimeFormatter.ofPattern("EEE")),
                        "score", r.getScore()
                ))
                .toList();

        var recentNotes = noteRepository.findByUserIdOrderByCreatedAtDesc(userId, PageRequest.of(0, 3));
        var recentQuestionnaires = questionnaireResultRepository.findByUserIdOrderByCreatedAtDesc(userId, PageRequest.of(0, 3));

        var noteActivities = recentNotes.stream()
                .map(n -> Map.of(
                        "type", "note",
                        "createdAt", n.getCreatedAt().toString(),
                        "message", "Added note: " + n.getTitle()
                ))
                .toList();

        var questionnaireActivities = recentQuestionnaires.stream()
                .map(q -> Map.of(
                        "type", "questionnaire",
                        "createdAt", q.getCreatedAt().toString(),
                        "message", "Completed questionnaire: score " + q.getScore() + "/100"
                ))
                .toList();

        var recentActivity = java.util.stream.Stream.concat(noteActivities.stream(), questionnaireActivities.stream())
                .sorted((a, b) -> String.valueOf(b.get("createdAt")).compareTo(String.valueOf(a.get("createdAt"))))
                .limit(5)
                .collect(Collectors.toList());

        int streak = Math.max(0, latestResults.size());

        return new LinkedHashMap<>(Map.of(
                "trend", trend,
                "recentActivity", recentActivity,
                "streak", streak
        ));
    }
}
