// src/components/Achievements.tsx
import React from 'react';

interface AchievementsProps {
  xpCreatedLogin: number;
  xpSubscriptionsMonths: number;
  xpLatest3DaysArticlePageViews: number;
}

interface Achievement {
  image: string;
  tooltip: string;
}

const Achievements: React.FC<AchievementsProps> = ({
  xpCreatedLogin,
  xpSubscriptionsMonths,
  xpLatest3DaysArticlePageViews,
}) => {
  const achievements: Achievement[] = [];

  // Convert to numbers and handle null/undefined
  const articleViews = Number(xpLatest3DaysArticlePageViews) || 0;
  
  // Debug: Log the values to check what's being received
  console.log('Achievement values:', {
    xpCreatedLogin,
    xpSubscriptionsMonths,
    xpLatest3DaysArticlePageViews,
    articleViews,
    articleViewsType: typeof articleViews,
    isArticleViewsGreaterEqual1: articleViews >= 1,
    isArticleViewsGreaterEqual1000: articleViews >= 1000,
    isArticleViewsExactly1000: articleViews === 1000
  });

  // Check each achievement condition and add the image path and tooltip if condition is met
  if (xpCreatedLogin > 0) {
    achievements.push({
      image: '/achievement_created_login.png',
      tooltip: 'Created login account'
    });
  }

  if (xpSubscriptionsMonths > 0) {
    achievements.push({
      image: '/achievement_started_subscribing.png',
      tooltip: 'Started subscription'
    });
  }

  // Check for exact match of 1000 (handle both number and string, and ensure it's exactly 1000)
  if (xpSubscriptionsMonths === 1000) {
    achievements.push({
      image: '/achivement_subscribe_more_than_1_year.png',
      tooltip: 'Subscribed more than one year'
    });
  }

  // XP_latest_3_days_article_page_views >= 1 -> show read one article
  if (articleViews >= 1) {
    achievements.push({
      image: '/achivement_read_one_article.png',
      tooltip: 'Read one article'
    });
  }

  // XP_latest_3_days_article_page_views >= 1000 -> show read 1000 articles
  if (articleViews >= 1000) {
    achievements.push({
      image: '/achivement_read_1000_articles.png',
      tooltip: 'Read many articles'
    });
  }

  if (achievements.length === 0) {
    return null; // Don't render anything if no achievements
  }

  return (
    <div className="achievements-container">
      {achievements.map((achievement, index) => (
        <div key={index} className="achievement-box">
          <img
            src={achievement.image}
            alt={achievement.tooltip}
            className="achievement-image"
          />
          <span className="achievement-tooltip">{achievement.tooltip}</span>
        </div>
      ))}
    </div>
  );
};

export default Achievements;

