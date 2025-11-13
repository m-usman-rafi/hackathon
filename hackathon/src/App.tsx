// src/App.tsx (Corrected Version)

import { useState, useEffect } from 'react';
import UserProfileCard from './components/UserProfileCard';
import StreakCounter from './components/StreakCounter';
import { fetchUserProfile } from './api/api';
import { UserProfileData } from './types/GamificationTypes';
import './App.css'; 
import './components/Gamification.css';
import Leaderboard from './components/Leaderboard'; // <-- Keep this import


const MOCK_USER_ID = '3574368165637449459';

function App() {
  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchUserProfile(MOCK_USER_ID);
        setUserData(data);
      } catch (error) {
        console.error("Failed to load user data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>Loading Gamification Profile...</h2>
            <p>Fetching data from the back-end...</p>
        </div>
    );
  }

  if (!userData) {
    return <div>Error loading profile data. Please try again.</div>;
  }

  // 👇 THIS IS THE ONLY RETURN STATEMENT THAT SHOULD REMAIN 👇
  return (
    <div className="gamification-dashboard">
      <h1>Your Reader Status</h1>
      
      {/* Existing components */}
      <UserProfileCard data={userData} /> 
      <StreakCounter currentStreak={userData.currentStreak} /> 
      
      {/* RENDER THE LEADERBOARD HERE */}
      <Leaderboard /> 
    </div>
  );
  // 👆 ALL CODE BELOW THIS POINT WAS REDUNDANT AND HAS BEEN DELETED 👆
}

export default App;