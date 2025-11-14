# server/app.py

from flask import Flask, jsonify
from flask_cors import CORS
from bigquery_service import fetch_user_profile_data, fetch_global_leaderboard
from typing import Dict, Any

app = Flask(__name__)
# Enable CORS to allow your React app (on port 5173) to communicate 
# with this Flask server (on port 5000).
CORS(app) 

# --- API Endpoint for User Profile (Rank, Streak, Points) ---
@app.route('/api/profile/<user_id>', methods=['GET'])
def get_user_profile(user_id):
    """Corresponds to fetchUserProfile(userId) in the React app."""
    try:
        data: Dict[str, Any] = fetch_user_profile_data(user_id)
    except Exception as e:
        # Catch BigQuery connection or SQL errors and log them
        print(f"Error fetching profile data for {user_id}: {e}")
        return jsonify({"error": "Internal server error fetching user data"}), 500

    if not data:
        return jsonify({"error": "User not found"}), 404
        
    # Determine avatar URL based on user level
    level = data.get("level", 1)
    if level == 1:
        avatar_url = "/level_1_avatar.png"
    elif level == 2:
        avatar_url = "/level_2_avatar.png"
    elif level == 3:
        avatar_url = "/level_3_avatar.png"
    else:
        avatar_url = "https://placehold.co/80x80/007bff/white?text=A"  # Fallback placeholder
        
    # **MAPPING CRITICAL STEP:**
    # Map Python snake_case keys from BigQuery/Service to React's camelCase keys.
    # Ensure username is always a string to prevent precision loss for large integers
    username = data.get("username", "Unknown Reader")
    if username is not None:
        username = str(username)  # Convert to string to preserve full precision
    
    response_data = {
        "userId": str(user_id),  # Ensure userId is always a string
        "username": username,
        "level": level, 
        "currentPoints": data.get("current_points", 0),
        "nextLevelPoints": data.get("next_level_points", 1000), 
        "avatarUrl": avatar_url,
        "currentStreak": data.get("current_streak", 0), # Mapped from current_streak
        "rank": data.get("rank", 999),
        "xpCreatedLogin": data.get("XP_CREATED_LOGIN", 0),
        "xpSubscriptionsMonths": data.get("XP_subscriptions_months", 0),
        "xpLatest3DaysArticlePageViews": data.get("XP_latest_3_days_article_page_views", 0),
    }
    
    return jsonify(response_data)


# --- API Endpoint for Leaderboard ---
@app.route('/api/leaderboard', methods=['GET'])
def get_leaderboard():
    """Corresponds to fetchLeaderboardData() in the React app."""
    try:
        leaderboard_data = fetch_global_leaderboard()
    except Exception as e:
        print(f"Error fetching leaderboard data: {e}")
        return jsonify({"error": "Internal server error fetching leaderboard"}), 500
        
    # The keys returned by fetch_global_leaderboard (username, points, rank) 
    # should already align with the LeaderboardEntry type.
    return jsonify(leaderboard_data)


# --- SERVER STARTUP ---
if __name__ == '__main__':
    # Flask will now start and listen on port 5000
    app.run(debug=True, port=5000)