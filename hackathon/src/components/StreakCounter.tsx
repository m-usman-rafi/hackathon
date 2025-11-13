// src/components/StreakCounter.tsx
import React from 'react';
import { FaFire } from 'react-icons/fa'; // Requires 'react-icons'

// Define props with type checking
interface StreakCounterProps {
    currentStreak: number;
}

const StreakCounter: React.FC<StreakCounterProps> = ({ currentStreak }) => {
  const isStreaking = currentStreak > 0;
  
  return (
    <div className={`streak-counter ${isStreaking ? 'active-streak' : 'inactive-streak'}`}>
      <FaFire size={30} color={isStreaking ? '#ff4500' : '#ccc'} />
      <div className="streak-details">
        <span className="streak-number">**{currentStreak}**</span>
        <p className="streak-label">Day Streak</p>
      </div>
    </div>
  );
};

export default StreakCounter;

// Note: In a real project, these styles would be in a separate CSS/SCSS file.
// For example: src/components/StreakCounter.css