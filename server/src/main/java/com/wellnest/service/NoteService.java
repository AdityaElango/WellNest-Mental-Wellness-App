package com.wellnest.service;

import java.time.Instant;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.wellnest.dto.NoteDtos.NoteRequest;
import com.wellnest.model.Note;
import com.wellnest.repository.NoteRepository;

@Service
public class NoteService {
    private final NoteRepository noteRepository;

    public NoteService(NoteRepository noteRepository) {
        this.noteRepository = noteRepository;
    }

    public Page<Note> list(String userId, String q, int page, int size) {
        int safePage = Math.max(0, page);
        int safeSize = Math.min(Math.max(1, size), 50);
        var pageable = PageRequest.of(safePage, safeSize, Sort.by(Sort.Direction.DESC, "updatedAt"));
        if (q == null || q.isBlank()) {
            return noteRepository.findByUserId(userId, pageable);
        }
        return noteRepository.searchByUserId(userId, q, pageable);
    }

    public Note create(String userId, NoteRequest request) {
        Note note = new Note();
        note.setUserId(userId);
        note.setTitle(request.title());
        note.setContent(request.content());
        note.setTags(normalizeTags(request.tags()));
        note.setCreatedAt(Instant.now());
        note.setUpdatedAt(Instant.now());
        return noteRepository.save(note);
    }

    public Note update(String userId, String noteId, NoteRequest request) {
        Note note = noteRepository.findById(noteId)
                .filter(n -> n.getUserId().equals(userId))
                .orElseThrow(() -> new IllegalArgumentException("Note not found"));
        note.setTitle(request.title());
        note.setContent(request.content());
        note.setTags(normalizeTags(request.tags()));
        note.setUpdatedAt(Instant.now());
        return noteRepository.save(note);
    }

    public void delete(String userId, String noteId) {
        Note note = noteRepository.findById(noteId)
                .filter(n -> n.getUserId().equals(userId))
                .orElseThrow(() -> new IllegalArgumentException("Note not found"));
        noteRepository.delete(note);
    }

    private List<String> normalizeTags(List<String> tags) {
        if (tags == null) return List.of();
        return tags.stream()
                .filter(tag -> tag != null && !tag.isBlank())
                .map(String::trim)
                .distinct()
                .toList();
    }
}
