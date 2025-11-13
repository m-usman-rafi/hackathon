// src/components/Leaderboard.tsx

import React, { useState, useEffect } from 'react';
import LeaderboardRow from './LeaderboardRow';
import { fetchLeaderboardData } from '../api/api';
import { LeaderboardEntry } from '../types/GamificationTypes';

// This ID should match the one used in App.tsx and api.ts
const CURRENT_USER_ID = '3574368165637449459'; 

const Leaderboard: React.FC = () => {
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
          {leaderboard.map((entry) => (
            <LeaderboardRow
              key={entry.userId}
              entry={entry}
              isCurrentUser={entry.userId === CURRENT_USER_ID}
            />
          ))}
      </div>
    </div>
  );
};

export default Leaderboard;