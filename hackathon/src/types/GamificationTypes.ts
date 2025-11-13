// src/types/GamificationTypes.ts

/**
 * Defines the structure for a single user's profile and progress data.
 */
export interface UserProfileData {
  userId: string;
  username: string;
  level: number;
  currentPoints: number;
  nextLevelPoints: number; // The points required to reach the next level
  avatarUrl: string;
  currentStreak: number; // Days in a row the user has engaged
  rank: number; // User's current rank on the overall leaderboard
}

/**
 * Defines the structure for a single row on the leaderboard (optional for this request, but useful).
 */
export interface LeaderboardEntry {
  userId: string;
  username: string;
  points: number;
  rank: number;
}