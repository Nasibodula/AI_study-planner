// routes/focusTracking.js
const express = require('express');
const router = express.Router();
const FocusSession = require('../models/FocusSession');
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Start a new focus tracking session
router.post('/sessions/start', async (req, res) => {
  try {
    const newSession = new FocusSession({
      userId: req.userId,
      startTime: new Date()
    });
    
    await newSession.save();
    
    res.status(201).json({
      success: true,
      sessionId: newSession._id,
      message: 'Focus tracking session started'
    });
  } catch (error) {
    console.error('Error starting focus session:', error);
    res.status(500).json({ error: 'Failed to start focus session' });
  }
});

// Update focus session with real-time data
router.post('/sessions/:sessionId/update', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { isFocused, eyeDistance, eyeNoseDistance, leftIrisPosition, rightIrisPosition, focusScore } = req.body;
    
    const session = await FocusSession.findById(sessionId);
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    // Check if user owns this session
    if (session.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized access to session' });
    }
    
    // Add new data point
    session.focusDataPoints.push({
      timestamp: new Date(),
      isFocused,
      eyeDistance,
      eyeNoseDistance,
      leftIrisPosition,
      rightIrisPosition,
      focusScore
    });
    
    // Update peak focus if current score is higher
    if (focusScore > session.peakFocusScore) {
      session.peakFocusScore = focusScore;
    }
    
    await session.save();
    
    res.json({
      success: true,
      message: 'Focus data updated'
    });
  } catch (error) {
    console.error('Error updating focus data:', error);
    res.status(500).json({ error: 'Failed to update focus data' });
  }
});

// End a focus tracking session
router.post('/sessions/:sessionId/end', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await FocusSession.findById(sessionId);
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    // Check if user owns this session
    if (session.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized access to session' });
    }
    
    const endTime = new Date();
    const totalDuration = Math.floor((endTime - session.startTime) / 1000); // in seconds
    
    // Calculate focused duration
    const focusedDataPoints = session.focusDataPoints.filter(point => point.isFocused);
    const focusedDuration = focusedDataPoints.length; // Assuming one data point per second
    
    // Calculate average focus score
    const totalFocusScore = session.focusDataPoints.reduce((sum, point) => sum + (point.focusScore || 0), 0);
    const averageFocusScore = session.focusDataPoints.length > 0 
      ? totalFocusScore / session.focusDataPoints.length 
      : 0;
    
    // Update session with final stats
    session.endTime = endTime;
    session.totalDuration = totalDuration;
    session.focusedDuration = focusedDuration;
    session.averageFocusScore = parseFloat(averageFocusScore.toFixed(2));
    
    await session.save();
    
    res.json({
      success: true,
      session: {
        id: session._id,
        startTime: session.startTime,
        endTime: session.endTime,
        totalDuration,
        focusedDuration,
        peakFocusScore: session.peakFocusScore,
        averageFocusScore: session.averageFocusScore
      },
      message: 'Focus tracking session ended'
    });
  } catch (error) {
    console.error('Error ending focus session:', error);
    res.status(500).json({ error: 'Failed to end focus session' });
  }
});

// Get all sessions for a user
router.get('/sessions', async (req, res) => {
  try {
    const sessions = await FocusSession.find({ 
      userId: req.userId 
    }).sort({ startTime: -1 });
    
    res.json({
      success: true,
      sessions: sessions.map(session => ({
        id: session._id,
        startTime: session.startTime,
        endTime: session.endTime,
        totalDuration: session.totalDuration,
        focusedDuration: session.focusedDuration,
        peakFocusScore: session.peakFocusScore,
        averageFocusScore: session.averageFocusScore,
        isActive: !session.endTime
      }))
    });
  } catch (error) {
    console.error('Error fetching focus sessions:', error);
    res.status(500).json({ error: 'Failed to fetch focus sessions' });
  }
});

// Get detailed session data by ID
router.get('/sessions/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await FocusSession.findById(sessionId);
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    // Check if user owns this session
    if (session.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized access to session' });
    }
    
    res.json({
      success: true,
      session
    });
  } catch (error) {
    console.error('Error fetching session details:', error);
    res.status(500).json({ error: 'Failed to fetch session details' });
  }
});

// Get graph data for NVIDIA cuGraph analysis
router.get('/graph-data', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Query filter based on date range
    const filter = { 
      userId: req.userId 
    };
    
    if (startDate && endDate) {
      filter.startTime = { 
        $gte: new Date(startDate), 
        $lte: new Date(endDate) 
      };
    }
    
    const sessions = await FocusSession.find(filter);
    
    // Create graph data
    const graphData = {
      nodes: [],
      edges: []
    };
    
    // Process sessions to build graph data
    sessions.forEach(session => {
      // Add session as a node
      const sessionNodeId = `session_${session._id}`;
      graphData.nodes.push({
        id: sessionNodeId,
        type: 'session',
        data: {
          startTime: session.startTime,
          endTime: session.endTime,
          totalDuration: session.totalDuration,
          focusedDuration: session.focusedDuration,
          peakFocusScore: session.peakFocusScore,
          averageFocusScore: session.averageFocusScore
        }
      });
      
      // Add user node if it doesn't exist
      const userNodeId = `user_${session.userId}`;
      if (!graphData.nodes.some(node => node.id === userNodeId)) {
        graphData.nodes.push({
          id: userNodeId,
          type: 'user',
          data: {
            userId: session.userId
          }
        });
      }
      
      // Add edge between user and session
      graphData.edges.push({
        source: userNodeId,
        target: sessionNodeId,
        type: 'HAS_SESSION'
      });
      
      // Process focus data points to create time-based nodes
      let prevDataPointId = null;
      
      session.focusDataPoints.forEach((dataPoint, index) => {
        const dataPointId = `datapoint_${session._id}_${index}`;
        
        graphData.nodes.push({
          id: dataPointId,
          type: 'datapoint',
          data: {
            timestamp: dataPoint.timestamp,
            isFocused: dataPoint.isFocused,
            focusScore: dataPoint.focusScore || 0
          }
        });
        
        // Connect data point to session
        graphData.edges.push({
          source: sessionNodeId,
          target: dataPointId,
          type: 'CONTAINS_DATAPOINT'
        });
        
        // Connect sequential data points to represent flow
        if (prevDataPointId) {
          graphData.edges.push({
            source: prevDataPointId,
            target: dataPointId,
            type: 'NEXT'
          });
        }
        
        prevDataPointId = dataPointId;
      });
    });
    
    // Write graph data to temp files for cuGraph processing
    const tempDir = path.join(__dirname, '../temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }
    
    const nodesFile = path.join(tempDir, `nodes_${req.userId}.csv`);
    const edgesFile = path.join(tempDir, `edges_${req.userId}.csv`);
    
    // Write nodes to CSV
    const nodeHeader = 'id,type,data\n';
    const nodeRows = graphData.nodes.map(node => 
      `${node.id},${node.type},${JSON.stringify(node.data)}`
    ).join('\n');
    fs.writeFileSync(nodesFile, nodeHeader + nodeRows);
    
    // Write edges to CSV
    const edgeHeader = 'source,target,type\n';
    const edgeRows = graphData.edges.map(edge => 
      `${edge.source},${edge.target},${edge.type}`
    ).join('\n');
    fs.writeFileSync(edgesFile, edgeHeader + edgeRows);
    
    // Execute Python script with NVIDIA cuGraph for analysis
    // This assumes you have a Python script that uses cuGraph
    const pythonScript = path.join(__dirname, '../scripts/analyze_focus_graph.py');
    const result = spawnSync('python', [
      pythonScript,
      nodesFile,
      edgesFile,
      tempDir,
      req.userId
    ]);
    
    if (result.error) {
      console.error('Error executing cuGraph analysis:', result.error);
      return res.status(500).json({ error: 'Failed to run graph analysis' });
    }
    
    // Read analysis results
    const analysisFile = path.join(tempDir, `analysis_${req.userId}.json`);
    let analysisResults;
    
    if (fs.existsSync(analysisFile)) {
      analysisResults = JSON.parse(fs.readFileSync(analysisFile, 'utf8'));
    } else {
      analysisResults = { error: 'Analysis results not found' };
    }
    
    // Return graph data and analysis results
    res.json({
      success: true,
      graphData,
      analysisResults
    });
    
    // Clean up temp files
    try {
      fs.unlinkSync(nodesFile);
      fs.unlinkSync(edgesFile);
      fs.unlinkSync(analysisFile);
    } catch (cleanupError) {
      console.warn('Error cleaning up temp files:', cleanupError);
    }
    
  } catch (error) {
    console.error('Error generating graph data:', error);
    res.status(500).json({ error: 'Failed to generate graph data' });
  }
});

module.exports = router;