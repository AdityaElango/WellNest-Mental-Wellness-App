package com.wellnest.model;

import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "questionnaire_results")
@CompoundIndex(name = "user_created_q_idx", def = "{'userId': 1, 'createdAt': -1}")
public class QuestionnaireResult {
    @Id
    private String id;
    private String userId;
    private int stress;
    private int sleep;
    private int mood;
    private int energy;
    private int score;
    private Instant createdAt;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public int getStress() { return stress; }
    public void setStress(int stress) { this.stress = stress; }
    public int getSleep() { return sleep; }
    public void setSleep(int sleep) { this.sleep = sleep; }
    public int getMood() { return mood; }
    public void setMood(int mood) { this.mood = mood; }
    public int getEnergy() { return energy; }
    public void setEnergy(int energy) { this.energy = energy; }
    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
