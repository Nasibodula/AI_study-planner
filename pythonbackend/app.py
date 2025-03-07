import nest_asyncio
nest_asyncio.apply()

from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import networkx as nx
from datetime import datetime
from arango import ArangoClient
import os

ARANGO_HOST = os.getenv('ARANGO_HOST')
ARANGO_USERNAME = os.getenv('ARANGO_USERNAME')
ARANGO_PASSWORD = os.getenv('ARANGO_PASSWORD')
DB_NAME = 'study_planner'

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes, simplified

# Initialize ArangoDB client
# You may want to replace these with environment variables
client = ArangoClient(hosts=ARANGO_HOST) 

# Connect to "_system" database as root user
sys_db = client.db('_system', username=ARANGO_USERNAME, password=ARANGO_PASSWORD)

# Create a new database if it doesn't exist
if not sys_db.has_database(DB_NAME):
    sys_db.create_database(DB_NAME)

# Connect to the database
db = client.db('study_planner', username=ARANGO_USERNAME, password=ARANGO_PASSWORD)


# Create collections if they don't exist
collections = ['users', 'focus_sessions', 'study_schedules', 'goals', 'topics']
for collection in collections:
    if not db.has_collection(collection):
        db.create_collection(collection)

if not db.has_collection('topic_relations'):
    db.create_collection('topic_relations', edge=True)

# Initialize collections
users = db.collection('users')
focus_sessions = db.collection('focus_sessions')
study_schedules = db.collection('study_schedules')
goals = db.collection('goals')
topics = db.collection('topics')
topic_relations = db.collection('topic_relations')

# Sample data initialization
def init_sample_data():
    # Add sample users if collection is empty
    if users.count() == 0:
        users.insert({
            "user_id": "user1",
            "name": "Dula",
            "email": "nasibo.com"
        })

    # Add sample topics if collection is empty
    if topics.count() == 0:
        sample_topics = [
            {"topic_id": "topic1", "name": "Calculus", "difficulty": 3},
            {"topic_id": "topic2", "name": "Physics", "difficulty": 4},
            {"topic_id": "topic3", "name": "Chemistry", "difficulty": 3},
            {"topic_id": "topic4", "name": "Biology", "difficulty": 2},
            {"topic_id": "topic5", "name": "Computer Science", "difficulty": 4}
        ]
        for topic in sample_topics:
            topics.insert(topic)

    # Add sample topic relations if collection is empty
    if topic_relations.count() == 0:
        sample_relations = [
            {"_from": "topics/topic1", "_to": "topics/topic2", "relationship": "prerequisite"},
            {"_from": "topics/topic2", "_to": "topics/topic3", "relationship": "related"},
            {"_from": "topics/topic3", "_to": "topics/topic4", "relationship": "related"},
            {"_from": "topics/topic4", "_to": "topics/topic5", "relationship": "optional"}
        ]
        for relation in sample_relations:
            topic_relations.insert(relation)

# Call initialization function
init_sample_data()

# Add this new endpoint to match what your frontend is expecting
@app.route('/users/<user_id>/sessions', methods=['POST'])
def create_user_session(user_id):
    """
    Save a focus tracking session to the database with RESTful URL
    """
    try:
        session_data = request.json
        if not session_data:
            return jsonify({"status": "error", "message": "No data provided"}), 400
            
        # Ensure user_id is set from the URL parameter
        session_data['user_id'] = user_id
        session_data['timestamp'] = datetime.now().isoformat()
        
        # Insert and capture the metadata
        meta = focus_sessions.insert(session_data)
        
        return jsonify({
            "status": "success", 
            "message": "Focus session saved", 
            "id": meta["_id"],
            "session_id": meta["_key"]  # Add session_id for frontend compatibility
        })
    except Exception as e:
        print(f"Error saving focus session: {str(e)}")
        return jsonify({"status": "error", "message": f"Failed to save: {str(e)}"}), 500

# Add PUT endpoint for updates
@app.route('/users/<user_id>/sessions/<session_id>', methods=['PUT'])
def update_user_session(user_id, session_id):
    """
    Update an existing focus session
    """
    try:
        session_data = request.json
        if not session_data:
            return jsonify({"status": "error", "message": "No data provided"}), 400
            
        # Ensure user_id matches
        if session_data.get('user_id') != user_id:
            return jsonify({"status": "error", "message": "User ID mismatch"}), 400
            
        # Update document in ArangoDB
        # First, find the document with the key/id
        aql = f"FOR doc IN focus_sessions FILTER doc._key == '{session_id}' RETURN doc"
        cursor = db.aql.execute(aql)
        docs = [doc for doc in cursor]
        
        if not docs:
            return jsonify({"status": "error", "message": "Session not found"}), 404
            
        # Get the document's ArangoDB _id
        doc_id = docs[0]["_id"]
        
        # Update the document
        focus_sessions.update({"_id": doc_id}, session_data)
        
        return jsonify({
            "status": "success", 
            "message": "Focus session updated",
            "id": session_id
        })
    except Exception as e:
        print(f"Error updating focus session: {str(e)}")
        return jsonify({"status": "error", "message": f"Failed to update: {str(e)}"}), 500

# API Endpoints
@app.route('/api/focus-session', methods=['POST'])
def save_focus_session():
    """
    Save a focus tracking session to the database
    """
    session_data = request.json
    session_data['timestamp'] = datetime.now().isoformat()
    focus_sessions.insert(session_data)
    return jsonify({"status": "success", "message": "Focus session saved"})

@app.route('/api/focus-sessions/<user_id>', methods=['GET'])
def get_focus_sessions(user_id):
    """Get all focus sessions for a user"""
    query = f"FOR doc IN focus_sessions FILTER doc.user_id == '{user_id}' RETURN doc"
    cursor = db.aql.execute(query)
    sessions = [doc for doc in cursor]
    return jsonify(sessions)

@app.route('/api/schedule', methods=['POST'])
def save_schedule():
    """Save a study schedule to the database"""
    schedule_data = request.json
    study_schedules.insert(schedule_data)
    return jsonify({"status": "success", "message": "Schedule saved"})

@app.route('/api/schedule/<user_id>', methods=['GET'])
def get_schedule(user_id):
    """Get the study schedule for a user"""
    query = f"FOR doc IN study_schedules FILTER doc.user_id == '{user_id}' RETURN doc"
    cursor = db.aql.execute(query)
    schedules = [doc for doc in cursor]
    if schedules:
        return jsonify(schedules[0])
    else:
        return jsonify({"error": "No schedule found"})

@app.route('/api/goals', methods=['POST'])
def save_goal():
    """Save a goal to the database"""
    goal_data = request.json
    goal_data['created_at'] = datetime.now().isoformat()
    goal_data['completed'] = False
    goals.insert(goal_data)
    return jsonify({"status": "success", "message": "Goal saved"})

@app.route('/api/goals/<user_id>', methods=['GET'])
def get_goals(user_id):
    """Get all goals for a user"""
    query = f"FOR doc IN goals FILTER doc.user_id == '{user_id}' RETURN doc"
    cursor = db.aql.execute(query)
    user_goals = [doc for doc in cursor]
    return jsonify(user_goals)

@app.route('/api/analyze/focus/<user_id>', methods=['GET'])
def analyze_focus(user_id):
    """Analyze focus patterns for a user - simplified version"""
    query = f"FOR doc IN focus_sessions FILTER doc.user_id == '{user_id}' RETURN doc"
    cursor = db.aql.execute(query)
    sessions = [doc for doc in cursor]

    if not sessions:
        return jsonify({"error": "No focus sessions found"})

    # Convert to DataFrame for analysis
    df = pd.DataFrame(sessions)

    # Basic analysis
    avg_focus_score = df['focus_score'].mean() if 'focus_score' in df.columns else 0
    total_study_time = df['total_time'].sum() if 'total_time' in df.columns else 0
    total_focused_time = df['focused_time'].sum() if 'focused_time' in df.columns else 0

    # Time analysis - when is focus highest?
    focus_by_time = {}
    if 'start_time' in df.columns and 'focus_score' in df.columns:
        # Extract hour from start_time
        df['hour'] = pd.to_datetime(df['start_time']).dt.hour
        # Calculate average focus score by hour
        focus_by_hour = df.groupby('hour')['focus_score'].mean().to_dict()
        # Find the optimal study time (hour with highest focus)
        optimal_hour = max(focus_by_hour, key=focus_by_hour.get) if focus_by_hour else None
        # Convert hour to formatted time
        optimal_time = f"{optimal_hour:02d}:00" if optimal_hour is not None else "N/A"
        focus_by_time = {
            "focus_by_hour": focus_by_hour,
            "optimal_time": optimal_time
        }

    # Topic analysis - focus per topic
    topic_focus = {}
    if 'topic' in df.columns and 'focus_score' in df.columns:
        # Calculate average focus score by topic
        topic_focus = df.groupby('topic')['focus_score'].mean().to_dict()

    # Basic graph analysis using NetworkX
    graph_analysis = {}
    if 'topic' in df.columns:
        G = nx.Graph()
        topics_list = df['topic'].unique().tolist()

        for topic in topics_list:
            G.add_node(topic)

        # Add edges based on topic relations from the database
        query = "FOR doc IN topic_relations RETURN doc"
        cursor = db.aql.execute(query)
        relations = [doc for doc in cursor]

        for rel in relations:
            from_topic = rel['_from'].split('/')[1]
            to_topic = rel['_to'].split('/')[1]
            G.add_edge(from_topic, to_topic, relationship=rel['relationship'])

        # Calculate PageRank to identify important topics if there are edges
        if G.number_of_edges() > 0:
            pagerank = nx.pagerank(G)
            graph_analysis = {
                "topic_importance": pagerank
            }
        else:
            graph_analysis = {"message": "Not enough data for graph analysis"}

    # Combine all analyses
    analysis_result = {
        "avg_focus_score": avg_focus_score,
        "total_study_time": total_study_time,
        "total_focused_time": total_focused_time,
        "focus_by_time": focus_by_time,
        "topic_focus": topic_focus,
        "graph_analysis": graph_analysis
    }

    return jsonify(analysis_result)

@app.route('/api/suggest/schedule/<user_id>', methods=['GET'])
def suggest_schedule(user_id):
    """Suggest an optimal study schedule based on focus patterns."""
    # Fetch all focus sessions for the user
    query = f"FOR doc IN focus_sessions FILTER doc.user_id == '{user_id}' RETURN doc"
    cursor = db.aql.execute(query)
    sessions = [doc for doc in cursor]

    if not sessions:
        return jsonify({
            "message": "No focus sessions found, providing default schedule",
            "suggested_schedule": [
                {"day": "Monday", "time": "09:00", "topic": "Calculus"},
                {"day": "Wednesday", "time": "10:00", "topic": "Physics"},
                {"day": "Friday", "time": "14:00", "topic": "Chemistry"}
            ]
        })

    # Convert to DataFrame for analysis
    df = pd.DataFrame(sessions)
    optimal_schedule = []
    days_of_week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    default_times = ['09:00', '14:00', '18:00']

    if 'start_time' in df.columns and 'focus_score' in df.columns and 'topic' in df.columns:
        # Parse start times
        df['datetime'] = pd.to_datetime(df['start_time'])
        df['day'] = df['datetime'].dt.day_name()
        df['hour'] = df['datetime'].dt.hour

        # Group by day, hour, and topic to find optimal times and topics
        grouped = df.groupby(['day', 'hour', 'topic'])['focus_score'].mean().reset_index()

        # Get top 5 day-hour-topic combinations
        top_times = grouped.sort_values('focus_score', ascending=False).head(5)

        # Generate schedule
        for _, row in top_times.iterrows():
            day = row['day']
            hour = row['hour']
            topic = row['topic']
            focus_score = float(row['focus_score'])

            optimal_schedule.append({
                "day": day,
                "time": f"{hour:02d}:00",
                "topic": topic,
                "focus_score": focus_score
            })
    else:
        # Create a default schedule if no timing data is available
        # Extract unique topics from focus_sessions
        topics_query = f"FOR doc IN focus_sessions FILTER doc.user_id == '{user_id}' RETURN DISTINCT doc.topic"
        cursor = db.aql.execute(topics_query)
        available_topics = [doc for doc in cursor]

        # If no topics in database, use defaults
        if not available_topics:
            available_topics = ["Calculus", "Physics", "Chemistry", "Computer Science"]

        # Create a basic schedule with default times
        for i, day in enumerate(days_of_week[:5]):  # Weekdays only
            topic_idx = i % len(available_topics)
            time_idx = i % len(default_times)

            optimal_schedule.append({
                "day": day,
                "time": default_times[time_idx],
                "topic": available_topics[topic_idx]
            })

    return jsonify({
        "suggested_schedule": optimal_schedule
    })


@app.route('/api/visualization/focus-heatmap/<user_id>', methods=['GET'])
def focus_heatmap(user_id):
    """Generate a focus heatmap data"""
    query = f"FOR doc IN focus_sessions FILTER doc.user_id == '{user_id}' RETURN doc"
    cursor = db.aql.execute(query)
    sessions = [doc for doc in cursor]

    if not sessions:
        # Return sample data if no sessions found
        return jsonify({
            "message": "No focus sessions found, providing sample data",
            "sample_data": [
                {"day": "Monday", "hour": 9, "focus_score": 85},
                {"day": "Monday", "hour": 14, "focus_score": 75},
                {"day": "Tuesday", "hour": 10, "focus_score": 90},
                {"day": "Wednesday", "hour": 11, "focus_score": 65},
                {"day": "Thursday", "hour": 15, "focus_score": 80},
                {"day": "Friday", "hour": 9, "focus_score": 95}
            ]
        })

    # Convert to DataFrame
    df = pd.DataFrame(sessions)

    # Check if we have the right columns
    if 'start_time' not in df.columns or 'focus_score' not in df.columns:
        return jsonify({"error": "Missing required data for visualization"})

    # Parse start times
    df['datetime'] = pd.to_datetime(df['start_time'])
    df['day'] = df['datetime'].dt.day_name()
    df['hour'] = df['datetime'].dt.hour

    # Group by day and hour to create heatmap data
    heatmap_data = df.groupby(['day', 'hour'])['focus_score'].mean().reset_index()

    # Convert to list of dicts for JSON serialization
    heatmap_list = heatmap_data.to_dict('records')

    return jsonify({
        "heatmap_data": heatmap_list
    })

@app.route('/api/knowledge-graph', methods=['GET'])
def get_knowledge_graph():
    """Get the knowledge graph of topics"""
    # Get all topics
    query = "FOR doc IN topics RETURN doc"
    cursor = db.aql.execute(query)
    all_topics = [doc for doc in cursor]

    # Get all topic relations
    query = "FOR doc IN topic_relations RETURN doc"
    cursor = db.aql.execute(query)
    all_relations = [doc for doc in cursor]

    # Format for visualization
    nodes = []
    for topic in all_topics:
        nodes.append({
            "id": topic["topic_id"],
            "label": topic["name"],
            "difficulty": topic.get("difficulty", 3)
        })

    edges = []
    for relation in all_relations:
        edges.append({
            "from": relation["_from"].split('/')[1],
            "to": relation["_to"].split('/')[1],
            "relationship": relation.get("relationship", "related")
        })

    return jsonify({
        "nodes": nodes,
        "edges": edges
    })

# Main execution
if __name__ == '__main__':
    # Configuration for local development
    port = int(os.environ.get('PORT', 5001))
    
    print(f"Starting Flask server on http://127.0.0.1:{port}")
    print("API endpoints available at:")
    print(f"  - http://127.0.0.1:{port}/api/focus-session")
    print(f"  - http://127.0.0.1:{port}/api/focus-sessions/<user_id>")
    print(f"  - http://127.0.0.1:{port}/api/schedule")
    print(f"  - http://127.0.0.1:{port}/api/schedule/<user_id>")
    print(f"  - http://127.0.0.1:{port}/api/analyze/focus/<user_id>")
    # print(f"  - http://127.0.0.1:{port}/api/analyze/focus/<user_id>")

    
    # Run the Flask app
if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5001))  # Default to 5001
    app.run(host='0.0.0.0', port=port)