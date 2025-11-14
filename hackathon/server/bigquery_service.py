# server/bigquery_service.py

from google.cloud import bigquery
from typing import List, Dict, Any

# 1. INITIALIZATION & CONFIGURATION
# ------------------------------------------------------------------
# Initialize the BigQuery client
try:
    # This relies on you running 'gcloud auth application-default login'
    client = bigquery.Client()
except Exception as e:
    # Handle case where credentials might not be set up yet
    print(f"Error initializing BigQuery client: {e}")
    client = None

# Define your project and dataset information (Used in the SQL FROM clause)
PROJECT_ID = "data-dbt-dev-bxjv"
DATASET_ID = "DEV_hack_XP_datamodeller"

# 2. HELPER FUNCTION
# ------------------------------------------------------------------
def execute_query(sql_query: str) -> List[Dict[str, Any]]:
    """Runs a BigQuery query and returns results as a list of dictionaries."""
    if client is None:
        # Raise an exception if initialization failed
        raise ConnectionError("BigQuery client not initialized. Check credentials setup.")
        
    query_job = client.query(sql_query)
    
    # Wait for the job to complete and get the results as dictionaries
    # NOTE: query_job.result() is necessary to fetch the data after the query runs
    results = [dict(row) for row in query_job.result()]
    return results

# 3. API DATA FUNCTIONS
# ------------------------------------------------------------------

def fetch_user_profile_data(user_id: str) -> Dict[str, Any]:
    """
    Fetches Rank, Streak, Points, and Level for a single user from BigQuery.
    """
    # NOTE: Assuming bnid_farm holds the user's unique ID.
    # Try integer comparison first (more efficient and likely correct for numeric IDs)
    print(f"Fetching profile data for user_id: {user_id}")
    
    results = []
    # Try integer comparison first if user_id is numeric
    try:
        user_id_int = int(user_id)
        sql_int = f"""
            with XAS as (
             SELECT
              y.bnid_farm as user_id,
              y.bnid_farm as username,
              y.XP_CREATED_LOGIN,
              y.XP_subscriptions_months,
              y.XP_latest_3_days_article_page_views,
                CAST(FLOOR(LN(CASE 
                WHEN y.XP_latest_3_days_article_page_views = 0 THEN 1 
                ELSE y.XP_latest_3_days_article_page_views 
                END)) AS INT64) as day_streak,
              y.XP_total,
              x.level,
              x.level_name,
              RANK() OVER (ORDER BY y.XP_total DESC) AS rank
            FROM `{PROJECT_ID}.{DATASET_ID}.user_xp` AS y
            JOIN `{PROJECT_ID}.{DATASET_ID}.levels` AS x
              ON y.XP_total >= x.xp_min
             AND (y.XP_total <= x.xp_max OR x.xp_max IS NULL)
            )
            SELECT
                  cast(t.user_id as string) as user_id,
                  cast(t.username as string) as username,
                  t.XP_total as current_points,
                  t.level,
                  t.level_name,
                  t.day_streak as current_streak,
                  t.XP_CREATED_LOGIN,
                  t.XP_subscriptions_months,
                  t.XP_latest_3_days_article_page_views,
                  t.rank
              FROM
                  XAS t
              WHERE
                  t.user_id = {user_id_int}
        """
        results = execute_query(sql_int)
        print(f"Integer query returned {len(results)} results")
    except (ValueError, Exception) as e:
        print(f"Could not use integer comparison, trying string: {e}")
    
    # If integer comparison didn't work or returned no results, try string comparison
    if not results:
        print(f"Trying string comparison for user_id: {user_id}")
        sql = f"""
            with XAS as (
             SELECT
              y.bnid_farm as user_id,  -- CRITICAL: Used for filtering/ID
              y.bnid_farm as username,  -- CRITICAL: Used for display name (if no real name column exists)
              y.XP_subscriptions_months,
              y.XP_CREATED_LOGIN,
              y.XP_latest_3_days_article_page_views,
            CAST(FLOOR(LN(CASE 
                WHEN y.XP_latest_3_days_article_page_views = 0 THEN 1 
                ELSE y.XP_latest_3_days_article_page_views 
                END)) AS INT64) as day_streak,
              y.XP_total,
              x.level,
              x.level_name,
              RANK() OVER (ORDER BY y.XP_total DESC) AS rank
            FROM `{PROJECT_ID}.{DATASET_ID}.user_xp` AS y
            JOIN `{PROJECT_ID}.{DATASET_ID}.levels` AS x
              ON y.XP_total >= x.xp_min
             AND (y.XP_total <= x.xp_max OR x.xp_max IS NULL)
            )
            SELECT
                  cast(t.user_id as string) as user_id,             -- Now included
                  cast(t.username as string) as username,            -- Now included
                  t.XP_total as current_points,
                  t.level,
                  t.level_name,
                  t.day_streak as current_streak,
                  t.XP_CREATED_LOGIN,
                  t.XP_subscriptions_months,
                  t.XP_latest_3_days_article_page_views,
                  t.rank
              FROM
                  XAS t
              WHERE
                  cast(t.user_id as string) = '{user_id}' -- Filtering by the user_id passed into the function
        """
        
        try:
            results = execute_query(sql)
            print(f"String query returned {len(results)} results")
        except Exception as e:
            print(f"Error with string query: {e}")
            import traceback
            traceback.print_exc()
            return {}
    
    if not results:
        print(f"User {user_id} not found in database")
        return {}
    
    data = results[0]
    
    # Next Level Points Logic (Based on your three-level structure)
    # Level 1: 1-100 points
    # Level 2: 101-3500 points
    # Level 3: 3501-5000 points (max level, capped at 5000)
    points = data.get('current_points', 0)
    level = data.get('level', 1)
    
    # Cap points at 5000 for level 3
    if points > 5000:
        points = 5000
        data['current_points'] = 5000
    
    if level == 1:
        data['next_level_points'] = 101  # Points needed to reach level 2
        data['current_level_min'] = 1    # Minimum points for current level
    elif level == 2:
        data['next_level_points'] = 3501  # Points needed to reach level 3
        data['current_level_min'] = 101   # Minimum points for current level
    else: # Level 3 (Max level)
        data['next_level_points'] = 5000  # Max cap at 5000
        data['current_level_min'] = 3501  # Minimum points for current level 
        
    return data


def fetch_global_leaderboard() -> List[Dict[str, Any]]:
    """
    Fetches the top 10 entries for the global leaderboard.
    """
    # NOTE: Leaderboard only requires username, points, and rank.
    sql = f"""
            with XAS as (
        SELECT
        y.bnid_farm as user_id,
        y.bnid_farm as username,
        y.XP_total,
        RANK() OVER (ORDER BY y.XP_total DESC) AS rank
        FROM `{PROJECT_ID}.{DATASET_ID}.user_xp` AS y
        )
        SELECT 
            cast(user_id as string) as userId,
            cast(username as string) as username,
            XP_total as points,
            rank
        FROM XAS
        ORDER BY rank ASC 
        LIMIT 10
    """
    try:
        return execute_query(sql)
    except Exception as e:
        print(f"Error fetching leaderboard data: {e}")
        return []