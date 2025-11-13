// src/components/LeaderboardRow.tsx

import React from 'react';
import { LeaderboardEntry } from '../types/GamificationTypes';

interface LeaderboardRowProps {
    entry: LeaderboardEntry;
    isCurrentUser: boolean;
}

const LeaderboardRow: React.FC<LeaderboardRowProps> = ({ entry, isCurrentUser }) => {
  const { rank, username, points } = entry;
  
  // Use a special class for the current user for visual highlighting
  const rowClasses = `leaderboard-row ${isCurrentUser ? 'current-user-row' : ''}`;

  return (
    <div className={rowClasses}>
      <span className="rank-number">
        {rank === 1 && '🥇'}
        {rank === 2 && '🥈'}
        {rank === 3 && '🥉'}
        {rank > 3 && <span className="rank-text">{rank}</span>}
      </span>
      <span className="user-name">{username}</span>
      <span className="user-points">{points} pts</span>
    </div>
  );
};

export default LeaderboardRow;