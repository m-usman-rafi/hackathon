// src/components/Leaderboard.tsx

import React, { useState, useEffect } from 'react';
import LeaderboardRow from './LeaderboardRow';
import { fetchLeaderboardData } from '../api/api';
import type { LeaderboardEntry, UserProfileData } from '../types/GamificationTypes';

interface LeaderboardProps {
  currentUserData: UserProfileData;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ currentUserData }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const data = await fetchLeaderboardData();
        setLeaderboard(data);
      } catch (error) {
        console.error("Failed to load leaderboard:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadLeaderboard();
  }, []);

  if (isLoading) {
    return <div className="leaderboard-loading">Loading Leaderboard...</div>;
  }
  
  if (leaderboard.length === 0) {
      return <div className="leaderboard-empty">No leaderboard data available.</div>;
  }

  // Check if current user is in the top 10
  const currentUserInTop10 = leaderboard.some(entry => entry.userId === currentUserData.userId);
  
  // Create current user entry if not in top 10
  const currentUserEntry: LeaderboardEntry | null = currentUserInTop10 
    ? null 
    : {
        userId: currentUserData.userId,
        username: currentUserData.username,
        points: currentUserData.currentPoints,
        rank: currentUserData.rank
      };

  // Separate top 10 and current user entry
  const top10Entries = leaderboard;
  const displayEntries = currentUserEntry 
    ? [...top10Entries, currentUserEntry]
    : top10Entries;

  return (
    <div className="leaderboard-container">
      <h2>Global Leaderboard</h2>
      
      {/* Header Row */}
      <div className="leaderboard-header">
          <span className="rank-number">Rank</span>
          <span className="user-name">User</span>
          <span className="user-points">Points</span>
      </div>
      
      {/* Data Rows */}
      <div className="leaderboard-rows-wrapper">
          {displayEntries.map((entry, index) => {
            const isCurrentUser = entry.userId === currentUserData.userId;
            const isSeparator = currentUserEntry && index === top10Entries.length;
            
            return (
              <React.Fragment key={`entry-${entry.userId}-${index}`}>
                {isSeparator && (
                  <div className="leaderboard-separator" key="separator">
                    <span>...</span>
                  </div>
                )}
                <LeaderboardRow
                  entry={entry}
                  isCurrentUser={isCurrentUser}
                />
              </React.Fragment>
            );
          })}
      </div>
    </div>
  );
};

export default Leaderboard;