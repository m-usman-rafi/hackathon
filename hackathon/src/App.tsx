import React, { useState, useEffect } from 'react';
import UserProfileCard from './components/UserProfileCard';
import StreakCounter from './components/StreakCounter';
import { fetchUserProfile } from './api/api';
import { UserProfileData } from './types/GamificationTypes';
import './App.css'; // Keep or modify your main CSS import
import './components/Gamification.css';


const MOCK_USER_ID = 'user-123'; // ID for the logged-in user

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
  }, []); // Run only once on initial render

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

  return (
    <div className="gamification-dashboard">
      <h1>Your Reader Status</h1>
      
      {/* Pass the entire data object to the profile card */}
      <UserProfileCard data={userData} /> 
      
      {/* Extract the streak property for the counter */}
      <StreakCounter currentStreak={userData.currentStreak} /> 
      
      {/* Leaderboard component will go here later */}
    </div>
  );
}

export default App;