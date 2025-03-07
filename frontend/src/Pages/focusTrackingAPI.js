const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// In your focusTrackingAPI.js
export const saveFocusSession = async (sessionData) => {
  try {
    // Log the initial data we're working with
    console.log('Saving focus session with data:', sessionData);
    
    // Check if session_id or id exists and normalize to id
    if (sessionData.session_id && !sessionData.id) {
      console.log('Converting session_id to id for consistency');
      sessionData.id = sessionData.session_id;
      delete sessionData.session_id;
    }
    
    // Ensure user_id exists
    if (!sessionData.user_id) {
      console.error('Missing user_id in session data');
      throw new Error('user_id is required for saving a focus session');
    }
    
    // Use the correct backend endpoint
    const url = `${API_BASE_URL}/api/focus-session`;
    
    console.log(`Making POST request to: ${url}`);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sessionData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to save focus session: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    console.log(`Session ${sessionData.id ? 'updated' : 'created'} successfully:`, result);
    
    return result;
  } catch (error) {
    console.error('Error saving focus session:', error);
    throw error;
  }
};

// Helper function to create a sample focus session for testing
export const createSampleFocusSession = (userId, topic = 'Calculus') => {
  const now = new Date();
  const startTime = new Date(now.getTime() - (90 * 60000)); // 90 minutes ago
  
  return {
    user_id: userId,
    start_time: startTime.toISOString(),
    end_time: now.toISOString(),
    focus_score: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
    focused_time: Math.floor(Math.random() * 30) + 60, // Random time between 60-90 minutes
    total_time: 90, // 90 minutes total
    topic: topic
  };
};

// Function to populate sample data for testing
export const populateSampleData = async (userId) => {
  const topics = ['Calculus', 'Physics', 'Chemistry', 'Biology', 'Computer Science'];
  const results = [];
  
  // Create 10 sample focus sessions over the past 10 days
  for (let i = 0; i < 10; i++) {
    const topic = topics[i % topics.length];
    const daysAgo = i;
    
    const now = new Date();
    now.setDate(now.getDate() - daysAgo);
    
    // Create a morning session
    const morningStart = new Date(now);
    morningStart.setHours(9, 0, 0);
    const morningEnd = new Date(morningStart);
    morningEnd.setHours(10, 30, 0);
    
    const morningSession = {
      user_id: userId,
      start_time: morningStart.toISOString(),
      end_time: morningEnd.toISOString(),
      focus_score: Math.floor(Math.random() * 20) + 80, // 80-100
      focused_time: Math.floor(Math.random() * 20) + 70, // 70-90
      total_time: 90,
      topic
    };
    
    // Create an afternoon session
    const afternoonStart = new Date(now);
    afternoonStart.setHours(14, 0, 0);
    const afternoonEnd = new Date(afternoonStart);
    afternoonEnd.setHours(15, 30, 0);
    
    const afternoonSession = {
      user_id: userId,
      start_time: afternoonStart.toISOString(),
      end_time: afternoonEnd.toISOString(),
      focus_score: Math.floor(Math.random() * 20) + 70, // 70-90
      focused_time: Math.floor(Math.random() * 20) + 60, // 60-80
      total_time: 90,
      topic: topics[(i + 2) % topics.length] // Different topic for variety
    };
    
    try {
      const resultMorning = await saveFocusSession(morningSession);
      const resultAfternoon = await saveFocusSession(afternoonSession);
      results.push(resultMorning, resultAfternoon);
      console.log(`Created session ${i*2+1} and ${i*2+2} of 20`);
    } catch (error) {
      console.error(`Failed to create sample sessions for day ${i}:`, error);
    }
  }
  
  return results;
};

// Function to get focus sessions for a user
export const getFocusSessions = async (userId) => {
  try {
    console.log(`Fetching focus sessions for user: ${userId}`);
    const response = await fetch(`${API_BASE_URL}/api/focus-sessions/${userId}`);
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`Retrieved ${data.length} focus sessions`);
    
    // Normalize session IDs - ensure each session has an 'id' field
    return data.map(session => {
      if (!session.id && session.session_id) {
        session.id = session.session_id;
      }
      return session;
    });
  } catch (error) {
    console.error('Error getting focus sessions:', error);
    throw error;
  }
};

// Rest of your existing functions with improved error handling
export const analyzeFocus = async (userId) => {
  try {
    console.log(`Analyzing focus data for user: ${userId}`);
    const response = await fetch(`${API_BASE_URL}/api/analyze/focus/${userId}`);
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error analyzing focus data:', error);
    throw error;
  }
};

export const getFocusHeatmap = async (userId) => {
  try {
    console.log(`Getting focus heatmap data for user: ${userId}`);
    const response = await fetch(`${API_BASE_URL}/api/visualization/focus-heatmap/${userId}`);
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting focus heatmap:', error);
    throw error;
  }
};

export const getSuggestedSchedule = async (userId) => {
  try {
    console.log(`Getting suggested schedule for user: ${userId}`);
    const response = await fetch(`${API_BASE_URL}/api/suggest/schedule/${userId}`);
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting suggested schedule:', error);
    throw error;
  }
};

export const saveSchedule = async (scheduleData) => {
  try {
    console.log(`Saving schedule:`, scheduleData);
    const response = await fetch(`${API_BASE_URL}/api/schedule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scheduleData),
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error saving schedule:', error);
    throw error;
  }
};

export const getSchedule = async (userId) => {
  try {
    console.log(`Getting schedule for user: ${userId}`);
    const response = await fetch(`${API_BASE_URL}/api/schedule/${userId}`);
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting schedule:', error);
    throw error;
  }
};

export const saveGoal = async (goalData) => {
  try {
    console.log(`Saving goal:`, goalData);
    const response = await fetch(`${API_BASE_URL}/api/goals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(goalData),
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error saving goal:', error);
    throw error;
  }
};

export const getGoals = async (userId) => {
  try {
    console.log(`Getting goals for user: ${userId}`);
    const response = await fetch(`${API_BASE_URL}/api/goals/${userId}`);
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting goals:', error);
    throw error;
  }
};

export const getKnowledgeGraph = async () => {
  try {
    console.log(`Getting knowledge graph`);
    const response = await fetch(`${API_BASE_URL}/api/knowledge-graph`);
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting knowledge graph:', error);
    throw error;
  }
};