package com.wellnest.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public class QuestionnaireDtos {
    public record QuestionnaireRequest(
            @Min(1) @Max(5) int stress,
            @Min(1) @Max(5) int sleep,
            @Min(1) @Max(5) int mood,
            @Min(1) @Max(5) int energy
    ) {}
}
