// src/components/UserProfileCard.tsx
import React from 'react';
import type { UserProfileData } from '../types/GamificationTypes';
import { FaTrophy } from 'react-icons/fa'; // Requires 'react-icons'

// Define the component props using the imported interface
interface UserProfileCardProps {
    data: UserProfileData;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ data }) => {
  const { username, level, currentPoints, nextLevelPoints, avatarUrl, rank } = data;
  
  // Calculate progress within the current level range
  // Level 1: 1-100, Level 2: 101-3500, Level 3: 3501-5000
  const getLevelRange = (level: number): { min: number; max: number } => {
    if (level === 1) return { min: 1, max: 100 };
    if (level === 2) return { min: 101, max: 3500 };
    if (level === 3) return { min: 3501, max: 5000 };
    return { min: 0, max: 0 };
  };
  
  const levelRange = getLevelRange(level);
  // Cap currentPoints at the max for the level
  const cappedPoints = Math.min(currentPoints, levelRange.max);
  // Calculate how many points the user has within this level's span
  // Subtract the level minimum to get points relative to the start of the level
  const pointsInLevel = Math.max(0, cappedPoints - levelRange.min);
  // Total points in this level's span (inclusive: if range is 1-100, that's 100 points)
  const totalPointsInLevel = levelRange.max - levelRange.min + 1;
  // Calculate progress percentage based on the level's span
  // Example: Level 1 (1-100): if user has 50 points, progress = (50-1)/(100-1+1) = 49/100 = 49%
  // Example: Level 1 (1-100): if user has 100 points, progress = (100-1)/(100-1+1) = 99/100 = 99%
  const progressPercent = totalPointsInLevel > 0 
    ? Math.min(100, (pointsInLevel / totalPointsInLevel) * 100)
    : 0;

  // Determine avatar based on user level
  const getAvatarUrl = () => {
    if (level === 1) {
      return '/level_1_avatar.png';
    } else if (level === 2) {
      return '/level_2_avatar.png';
    } else if (level === 3) {
      return '/level_3_avatar.png';
    }
    // Fallback to default avatarUrl if level is not 1, 2, or 3
    return avatarUrl;
  };

  // Get level title based on user level
  const getLevelTitle = () => {
    if (level === 1) {
      return 'The Journeyman';
    } else if (level === 2) {
      return 'The Knight';
    } else if (level === 3) {
      return 'The Queen';
    }
    return '';
  };

  return (
    <div className="user-profile-card">
        <div className="avatar-section">
            <img 
                src={getAvatarUrl()} 
                alt={`${username}'s Avatar`} 
                className="avatar-image" 
            />
            <span className="rank-badge">
                {rank === 1 && <FaTrophy color="#FFD700" />} Rank {rank}
            </span>
            <span className="level-title">{getLevelTitle()}</span>
        </div>

        <div className="profile-info">
            <h3>{username}</h3>
            <p className="level-tag">Level {level}</p>

            <div className="progress-container">
                <div className="progress-bar" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <p className="points-text">
                {level === 3 ? (
                  <>{Math.min(currentPoints, 5000)} / 5000 Points (Max Level)</>
                ) : (
                  <>{currentPoints} / {nextLevelPoints} Points to Level {level + 1}</>
                )}
            </p>
        </div>
    </div>
  );
};

export default UserProfileCard;

// Note: In a real project, these styles would be in a separate CSS/SCSS file.
// For example: src/components/UserProfileCard.css