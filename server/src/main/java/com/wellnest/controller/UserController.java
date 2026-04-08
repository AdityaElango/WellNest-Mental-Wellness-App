package com.wellnest.controller;

import java.util.Map;

import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wellnest.dto.UserDtos.UpdateProfileRequest;
import com.wellnest.service.CurrentUserService;
import com.wellnest.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
@Validated
public class UserController {
    private final UserService userService;
    private final CurrentUserService currentUserService;

    public UserController(UserService userService, CurrentUserService currentUserService) {
        this.userService = userService;
        this.currentUserService = currentUserService;
    }

    @GetMapping("/me")
    public Map<String, Object> me(Authentication authentication) {
        String userId = currentUserService.currentUserId(authentication);
        return userService.me(userId, authentication.getName());
    }

    @PutMapping("/me")
    public Map<String, Object> updateMe(Authentication authentication, @Valid @RequestBody UpdateProfileRequest request) {
        String userId = currentUserService.currentUserId(authentication);
        return userService.updateName(userId, request.name());
    }
}
