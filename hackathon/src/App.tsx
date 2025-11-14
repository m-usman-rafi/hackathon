// src/App.tsx (Corrected Version)

import { useState, useEffect } from 'react';
import UserProfileCard from './components/UserProfileCard';
import StreakCounter from './components/StreakCounter';
import Achievements from './components/Achievements';
import UserSearch from './components/UserSearch';
import { fetchUserProfile } from './api/api';
import { UserProfileData } from './types/GamificationTypes';
import './App.css'; 
import './components/Gamification.css';
import Leaderboard from './components/Leaderboard'; // <-- Keep this import


const DEFAULT_USER_ID = '3574368165637449459';

function App() {
  const [currentUserId, setCurrentUserId] = useState<string>(DEFAULT_USER_ID);
  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchUserProfile(currentUserId);
        setUserData(data);
        setError(null);
      } catch (error) {
        console.error("Failed to load user data:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        setError(errorMessage);
        setUserData(null);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [currentUserId]);

  const handleUserSearch = (userId: string) => {
    setCurrentUserId(userId);
  };

  // 👇 THIS IS THE ONLY RETURN STATEMENT THAT SHOULD REMAIN 👇
  return (
    <div className="gamification-dashboard">
      <div className="dashboard-header">
        <h1>The News Journey</h1>
        <UserSearch onSearch={handleUserSearch} currentUserId={currentUserId} />
      </div>
      
      {isLoading ? (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Loading Gamification Profile...</h2>
          <p>Fetching data from the back-end...</p>
        </div>
      ) : error || !userData ? (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Error loading profile data</h2>
          <p>{error || "User not found or data unavailable"}</p>
          <p style={{ fontSize: '0.9em', color: '#666' }}>User ID: {currentUserId}</p>
        </div>
      ) : (
        <>
          {/* Existing components */}
          <UserProfileCard data={userData} /> 
          <h2 className="achievements-header">Achievements</h2>
          <div className="streak-achievements-wrapper">
            <StreakCounter currentStreak={userData.currentStreak} /> 
            <Achievements 
              xpCreatedLogin={userData.xpCreatedLogin}
              xpSubscriptionsMonths={userData.xpSubscriptionsMonths}
              xpLatest3DaysArticlePageViews={userData.xpLatest3DaysArticlePageViews}
            />
          </div>
          
          {/* RENDER THE LEADERBOARD HERE */}
          <Leaderboard currentUserData={userData} />
        </>
      )}
    </div>
  );
  // 👆 ALL CODE BELOW THIS POINT WAS REDUNDANT AND HAS BEEN DELETED 👆
}

export default App;