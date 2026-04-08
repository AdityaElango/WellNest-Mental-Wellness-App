package com.wellnest.controller;

import java.util.Map;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wellnest.service.CurrentUserService;
import com.wellnest.service.DashboardService;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final DashboardService dashboardService;
    private final CurrentUserService currentUserService;

    public DashboardController(DashboardService dashboardService, CurrentUserService currentUserService) {
        this.dashboardService = dashboardService;
        this.currentUserService = currentUserService;
    }

    @GetMapping("/stats")
    public Map<String, Object> stats(Authentication authentication) {
        String userId = currentUserService.currentUserId(authentication);
        return dashboardService.stats(userId);
    }

    @GetMapping("/history")
    public Map<String, Object> history(Authentication authentication) {
        String userId = currentUserService.currentUserId(authentication);
        return dashboardService.history(userId);
    }
}
