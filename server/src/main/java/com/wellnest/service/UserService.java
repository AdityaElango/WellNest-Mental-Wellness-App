package com.wellnest.service;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.wellnest.model.User;
import com.wellnest.repository.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Map<String, Object> me(String userId, String authEmail) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        boolean changed = false;

        if ((user.getEmail() == null || user.getEmail().isBlank()) && authEmail != null && !authEmail.isBlank()) {
            user.setEmail(authEmail.trim());
            changed = true;
        }

        if (user.getName() == null || user.getName().isBlank()) {
            String seed = (user.getEmail() != null && !user.getEmail().isBlank()) ? user.getEmail() : authEmail;
            if (seed != null && !seed.isBlank()) {
                String fallback = seed.contains("@") ? seed.substring(0, seed.indexOf('@')) : seed;
                user.setName(fallback);
                changed = true;
            }
        }

        if (changed) {
            user = userRepository.save(user);
        }

        return toProfileResponse(user);
    }

    public Map<String, Object> updateName(String userId, String name) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setName(name.trim());
        User updated = userRepository.save(user);
        return toProfileResponse(updated);
    }

    private Map<String, Object> toProfileResponse(User user) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("id", user.getId() == null ? "" : user.getId());
        response.put("name", user.getName() == null ? "" : user.getName());
        response.put("email", user.getEmail() == null ? "" : user.getEmail());
        return response;
    }
}
