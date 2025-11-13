// src/components/UserProfileCard.tsx
import React from 'react';
import { UserProfileData } from '../types/GamificationTypes';
import { FaUserCircle, FaTrophy } from 'react-icons/fa'; // Requires 'react-icons'

// Define the component props using the imported interface
interface UserProfileCardProps {
    data: UserProfileData;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ data }) => {
  const { username, level, currentPoints, nextLevelPoints, avatarUrl, rank } = data;
  const progressPercent = (currentPoints / nextLevelPoints) * 100;

  return (
    <div className="user-profile-card">
        <div className="avatar-section">
            <img 
                src={avatarUrl} 
                alt={`${username}'s Avatar`} 
                className="avatar-image" 
            />
            <span className="rank-badge">
                <FaTrophy color="#FFD700" /> Rank **{rank}**
            </span>
        </div>

        <div className="profile-info">
            <h3>{username}</h3>
            <p className="level-tag">Level {level}</p>

            <div className="progress-container">
                <div className="progress-bar" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <p className="points-text">
                **{currentPoints}** / {nextLevelPoints} Points to Level {level + 1}
            </p>
        </div>
    </div>
  );
};

export default UserProfileCard;

// Note: In a real project, these styles would be in a separate CSS/SCSS file.
// For example: src/components/UserProfileCard.css