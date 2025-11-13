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
    sql = f"""
        with XAS as (
         SELECT
          y.bnid_farm as user_id,  -- CRITICAL: Used for filtering/ID
          y.bnid_farm as username,  -- CRITICAL: Used for display name (if no real name column exists)
          y.XP_latest_3_days_article_page_views,
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
              t.user_id,             -- Now included
              t.username,            -- Now included
              t.XP_total as current_points,
              t.level,
              t.level_name,
              t.XP_latest_3_days_article_page_views as current_streak,
              t.rank
          FROM
              XAS t
          WHERE
              cast(t.user_id as string) = '{user_id}' -- Filtering by the user_id passed into the function
    """
    
    try:
        results = execute_query(sql)
    except Exception as e:
        print(f"Error fetching user profile data: {e}")
        return {}
    
    if not results:
        return {}
    
    data = results[0]
    
    # Next Level Points Logic (Based on your three-level structure)
    points = data.get('current_points', 0)
    level = data.get('level', 1)
    
    if level == 1:
        data['next_level_points'] = 1000 # Points needed for level 2
    elif level == 2:
        data['next_level_points'] = 2500 # Points needed for level 3
    else: # Level 3 (Max level)
        # Setting next points slightly higher to fill the progress bar
        data['next_level_points'] = points + 1 
        
    return data


def fetch_global_leaderboard() -> List[Dict[str, Any]]:
    """
    Fetches the top 10 entries for the global leaderboard.
    """
    # NOTE: Leaderboard only requires username, points, and rank.
    sql = f"""
            with XAS as (
        SELECT
        y.bnid_farm as username,
        y.XP_total,
        RANK() OVER (ORDER BY y.XP_total DESC) AS rank
        FROM `{PROJECT_ID}.{DATASET_ID}.user_xp` AS y
        )
        SELECT 
            username,
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