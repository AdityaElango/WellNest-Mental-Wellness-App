package com.wellnest.controller;

import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.wellnest.dto.NoteDtos.NoteRequest;
import com.wellnest.dto.NoteDtos.NoteResponse;
import com.wellnest.dto.NoteDtos.PageResponse;
import com.wellnest.model.Note;
import com.wellnest.service.CurrentUserService;
import com.wellnest.service.NoteService;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/notes")
@Validated
public class NoteController {
    private final NoteService noteService;
    private final CurrentUserService currentUserService;

    public NoteController(NoteService noteService, CurrentUserService currentUserService) {
        this.noteService = noteService;
        this.currentUserService = currentUserService;
    }

    @GetMapping
    public PageResponse<NoteResponse> list(Authentication authentication,
                           @RequestParam(defaultValue = "") String q,
                           @RequestParam(defaultValue = "0") int page,
                           @RequestParam(defaultValue = "10") int size) {
        String userId = currentUserService.currentUserId(authentication);
        Page<Note> notes = noteService.list(userId, q, page, size);
        return new PageResponse<>(
                notes.getContent().stream().map(this::toResponse).toList(),
                notes.getNumber(),
                notes.getSize(),
                notes.getTotalElements(),
                notes.getTotalPages()
        );
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public NoteResponse create(Authentication authentication, @Valid @RequestBody NoteRequest request) {
        String userId = currentUserService.currentUserId(authentication);
        return toResponse(noteService.create(userId, request));
    }

    @PutMapping("/{id}")
    public NoteResponse update(Authentication authentication, @PathVariable String id, @Valid @RequestBody NoteRequest request) {
        String userId = currentUserService.currentUserId(authentication);
        return toResponse(noteService.update(userId, id, request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(Authentication authentication, @PathVariable String id) {
        String userId = currentUserService.currentUserId(authentication);
        noteService.delete(userId, id);
    }

    private NoteResponse toResponse(Note note) {
        return new NoteResponse(
                note.getId(),
                note.getTitle(),
                note.getContent(),
                note.getTags(),
                note.getCreatedAt(),
                note.getUpdatedAt()
        );
    }
}
