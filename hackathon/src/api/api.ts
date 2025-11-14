// src/api/api.ts

import type { UserProfileData, LeaderboardEntry } from '../types/GamificationTypes';

// 🎯 Set the base URL for your Python Flask server
const API_BASE_URL = 'http://localhost:5000/api'; 
const MOCK_USER_ID = '3574368165637449459'; // Still needed for the initial fetch


/**
 * Fetches the user's profile data (including Rank, Streak, and Points) 
 * from the Python/BigQuery backend.
 */
export async function fetchUserProfile(userId: string = MOCK_USER_ID): Promise<UserProfileData> {
  console.log(`[API] Fetching real profile data for user: ${userId}`);
  
  try {
    const response = await fetch(`${API_BASE_URL}/profile/${userId}`);

    if (!response.ok) {
      // Try to get error message from response
      let errorMessage = `HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(`Failed to fetch user profile: ${response.status} - ${errorMessage}`);
    }

    const data: UserProfileData = await response.json();
    return data;
  } catch (error) {
    // Handle network errors (server not running, CORS, etc.)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Network error: Unable to connect to server at ${API_BASE_URL}. Make sure the Flask server is running on port 5000.`);
    }
    // Re-throw other errors
    throw error;
  }
}


/**
 * Fetches the global leaderboard data from the Python/BigQuery backend.
 */
export async function fetchLeaderboardData(): Promise<LeaderboardEntry[]> {
  console.log('[API] Fetching real global leaderboard data...');
  
  const response = await fetch(`${API_BASE_URL}/leaderboard`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to fetch leaderboard: ${response.status} - ${errorData.error}`);
  }

  const data: LeaderboardEntry[] = await response.json();
  return data;
}