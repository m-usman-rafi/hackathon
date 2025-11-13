// src/api/api.ts
import { UserProfileData } from '../types/GamificationTypes';

/**
 * **MOCK API FUNCTION**
 * In a real application, this function would use `fetch` or a library like `axios`
 * to make an HTTP request (GET) to your Python back-end (e.g., '/api/v1/profile').
 */
export async function fetchUserProfile(userId: string): Promise<UserProfileData> {
  console.log(`Fetching profile data for user: ${userId}`);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500)); 

  // --- Mock Data that adheres strictly to UserProfileData interface ---
  const mockData: UserProfileData = {
    userId: userId,
    username: 'MagazineMaster',
    level: 7,
    currentPoints: 1450,
    nextLevelPoints: 2000,
    avatarUrl: 'https://placehold.co/80x80/007bff/white?text=A', // Placeholder image
    currentStreak: 12,
    rank: 45
  };

  return mockData;
}