package com.wellnest.dto;

import jakarta.validation.constraints.NotBlank;

public class UserDtos {
    public record UpdateProfileRequest(@NotBlank String name) {}
}
