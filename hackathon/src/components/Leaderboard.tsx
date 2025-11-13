/**
 * Defines the structure for a single row on the leaderboard.
 */
export interface LeaderboardEntry {
  userId: string;
  username: string;
  points: number;
  rank: number;
  // Optional flag to highlight the current user
  isCurrentUser?: boolean; 
}

/**
 * Defines the structure for the full leaderboard data response.
 */
export interface LeaderboardData {
    entries: LeaderboardEntry[];
    totalUsers: number;
}