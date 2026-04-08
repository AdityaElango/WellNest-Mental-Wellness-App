package com.wellnest.dto;

import jakarta.validation.constraints.NotBlank;

import java.time.Instant;
import java.util.List;

public class NoteDtos {
    public record NoteRequest(@NotBlank String title, String content, List<String> tags) {}
    public record NoteResponse(String id, String title, String content, List<String> tags, Instant createdAt, Instant updatedAt) {}
    public record PageResponse<T>(List<T> items, int page, int size, long totalItems, int totalPages) {}
}
