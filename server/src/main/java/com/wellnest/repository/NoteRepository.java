package com.wellnest.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.wellnest.model.Note;

public interface NoteRepository extends MongoRepository<Note, String> {
    Page<Note> findByUserId(String userId, Pageable pageable);
    @Query(value = "{ 'userId': ?0, '$or': [ { 'title': { $regex: ?1, $options: 'i' } }, { 'content': { $regex: ?1, $options: 'i' } }, { 'tags': { $regex: ?1, $options: 'i' } } ] }")
    Page<Note> searchByUserId(String userId, String query, Pageable pageable);
    long countByUserId(String userId);
    List<Note> findByUserIdOrderByCreatedAtDesc(String userId, Pageable pageable);
}
