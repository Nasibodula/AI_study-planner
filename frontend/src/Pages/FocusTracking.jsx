import { useRef, useEffect, useState } from 'react';
import { FaceMesh } from '@mediapipe/face_mesh';
import * as Facemesh from '@mediapipe/face_mesh';
import * as cam from '@mediapipe/camera_utils';
import { drawConnectors } from '@mediapipe/drawing_utils';
import Webcam from 'react-webcam';
import { authService } from '../services/authService';
import { 
  saveFocusSession, 
  getFocusSessions, 
  analyzeFocus, 
  getFocusHeatmap, 
  getSuggestedSchedule, 
  getSchedule, 
  getKnowledgeGraph 
} from './focusTrackingAPI';

function FocusTrackingPage() {
  
  // Setup references
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [isTracking, setIsTracking] = useState(false);
  const [isFocused, setIsFocused] = useState(true);
  const [focusScore, setFocusScore] = useState(0);
  const [focusedTime, setFocusedTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [peakFocus, setPeakFocus] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [optimalTime, setOptimalTime] = useState(null);
  const [knowledgeGraph, setKnowledgeGraph] = useState(null);
  const [focusHistory, setFocusHistory] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [focusData, setFocusData] = useState([]);
  const [topic, setTopic] = useState("Study Session");
  const [sessionStartTime, setSessionStartTime] = useState(null);
  var camera = null;
  const [currentUser, setCurrentUser] = useState(null);
  const [userId, setUserId] = useState(localStorage.getItem("userId") || "user1");

  useEffect(() => {
    // Fetch the current user from the authentication service
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setCurrentUser(currentUser);
      setUserId(currentUser.id); // Assuming the user object has an `id` field
    }
  }, []);

  // Function to calculate focus score
  const calculateFocusScore = (focusedTime, totalTime) => {
    return totalTime === 0 ? 0 : ((focusedTime / totalTime) * 100).toFixed(2);
  };

  // Function to detect focus
  const detectFocus = (landmarks) => {
    if (!landmarks) return false;
  
    // Get relevant landmarks
    const leftEye = landmarks[159];
    const rightEye = landmarks[386];
    const noseTip = landmarks[1];
    const leftEyeInner = landmarks[145];
    const rightEyeInner = landmarks[374];
  
    // Calculate eye position relative to the nose
    const eyeDistance = Math.abs(leftEye.x - rightEye.x);
    const eyeNoseDistance = Math.abs((leftEye.y + rightEye.y) / 2 - noseTip.y);
  
    // Calculate the horizontal position of the iris within the eye
    const leftIrisPosition = Math.abs(leftEye.x - leftEyeInner.x);
    const rightIrisPosition = Math.abs(rightEye.x - rightEyeInner.x);
  
    // Focus condition: Eyes are aligned and looking forward
    const isAligned = eyeDistance < 0.1 && eyeNoseDistance < 0.2;
    const isLookingForward = leftIrisPosition < 0.05 && rightIrisPosition < 0.05;
    const eyesCentered = (leftIrisPosition > 0.01 && leftIrisPosition < 0.04) && 
                         (rightIrisPosition > 0.01 && rightIrisPosition < 0.04);
  
    return isAligned && isLookingForward;
  };

  const onResults = async (results) => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) return;
    
    const canvasCtx = canvasElement.getContext("2d");

    // Clear canvas and draw video frame
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

    // Draw face mesh landmarks
    if (results.multiFaceLandmarks) {
      for (const landmarks of results.multiFaceLandmarks) {
        drawConnectors(canvasCtx, landmarks, Facemesh.FACEMESH_TESSELATION, { color: '#C0C0C070', lineWidth: 0.5 });
        drawConnectors(canvasCtx, landmarks, Facemesh.FACEMESH_RIGHT_EYE, { color: '#C0C0C070' });
        drawConnectors(canvasCtx, landmarks, Facemesh.FACEMESH_RIGHT_IRIS, { color: '#C0C0C070' });
        drawConnectors(canvasCtx, landmarks, Facemesh.FACEMESH_LEFT_EYE, { color: '#C0C0C070' });
        drawConnectors(canvasCtx, landmarks, Facemesh.FACEMESH_LEFT_IRIS, { color: '#30FF30' });
        drawConnectors(canvasCtx, landmarks, Facemesh.FACEMESH_FACE_OVAL, { color: '#C0C0C070' });
        drawConnectors(canvasCtx, landmarks, Facemesh.FACEMESH_LIPS, { color: '#C0C0C070' });

        // Detect focus
        const focused = detectFocus(landmarks);
        setIsFocused(focused);
      }
    }
  };

  // Save focus data point
  const saveFocusDataPoint = () => {
    if (!isTracking || !sessionId) return;
    
    const dataPoint = {
      timestamp: new Date().toISOString(),
      is_focused: isFocused,
      focus_score: parseFloat(focusScore)
    };
    
    setFocusData(prevData => [...prevData, dataPoint]);
  };

  // Fetch data from API
  const fetchData = async () => {
    try {
      // Get suggested schedule
      const scheduleData = await getSuggestedSchedule(userId);
      if (scheduleData && scheduleData.optimal_time) {
        setOptimalTime(scheduleData.optimal_time);
      }
      
      // Get knowledge graph
      const graphData = await getKnowledgeGraph();
      if (graphData) {
        setKnowledgeGraph(graphData);
      }
      
      // Get focus sessions history
      const sessionsData = await getFocusSessions(userId);
      if (sessionsData) {
        setFocusHistory(sessionsData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const initializeSession = async () => {
    if (!isTracking) return;
    
    try {
      const startTime = new Date();
      setSessionStartTime(startTime);
      
      // Generate a client-side session ID if the API doesn't return one
      const clientSessionId = `session_${userId}_${Date.now()}`;
      
      // Create session data
      const sessionData = {
        user_id: userId, // Use the current user's ID
        session_id: clientSessionId, // Add a client-generated ID
        start_time: startTime.toISOString(),
        end_time: startTime.toISOString(), // Will be updated when session ends
        focus_score: 0,
        focused_time: 0,
        total_time: 0,
        topic: topic || "Study Session",
        is_active: true
      };
      
      // Save the session
      const response = await saveFocusSession(sessionData);
      console.log("Session created response:", response);
      
      // Set the session ID regardless of API response
      setSessionId(clientSessionId);
      console.log("Session ID set:", clientSessionId);
    } catch (error) {
      console.error("Error initializing session:", error);
    }
  };
  
  const endSession = async () => {
    if (!sessionId) return;
    
    try {
      // Calculate the final focus score based on current state
      const currentFocusScore = calculateFocusScore(focusedTime, totalTime);
      
      // Ensure we have all required fields for the API
      const sessionData = {
        id: sessionId,
        user_id: userId, // Use the current user's ID
        start_time: sessionStartTime ? sessionStartTime.toISOString() : new Date(Date.now() - (totalTime * 1000)).toISOString(),
        end_time: new Date().toISOString(),
        focus_score: parseFloat(currentFocusScore),
        focused_time: parseInt(focusedTime),
        total_time: parseInt(totalTime),
        topic: topic || "Study Session",
        is_active: false,
        peak_focus: parseFloat(peakFocus),
        focus_data: focusData
      };
      
      console.log("Final session data:", sessionData);
      
      // Send the complete session data
      await saveFocusSession(sessionData);
      
      console.log("Session ended successfully");
      
      // Refresh data after session ends
      fetchData();
    } catch (error) {
      console.error("Error ending session:", error);
    }
  };

  useEffect(() => {
    if (!isTracking) return;

    const faceMesh = new FaceMesh({ 
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
      }
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults(onResults);

    if (webcamRef.current && webcamRef.current.video) {
      camera = new cam.Camera(webcamRef.current.video, {
        onFrame: async () => {
          await faceMesh.send({ image: webcamRef.current.video });
        },
        width: 640,
        height: 480,
      });
      camera.start();
    }

    return () => {
      if (camera) camera.stop();
    };
  }, [isTracking]);

  // Timer effect for tracking focus time
  useEffect(() => {
    let timer;
    if (isTracking) {
      timer = setInterval(() => {
        setTotalTime((prev) => prev + 1);
        if (isFocused) {
          setFocusedTime((prev) => prev + 1);
        }
        saveFocusDataPoint();
      }, 1000); // Update every second
    }
    return () => clearInterval(timer);
  }, [isTracking, isFocused]);

  // Calculate focus score effect
  useEffect(() => {
    const score = calculateFocusScore(focusedTime, totalTime);
    setFocusScore(score);

    // Update peak focus
    if (parseFloat(score) > peakFocus) {
      setPeakFocus(parseFloat(score));
    }

    // Detect drastic focus drop
    if (peakFocus - parseFloat(score) > 20) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  }, [focusedTime, totalTime]);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Effect to initialize session when tracking starts
  useEffect(() => {
    if (isTracking) {
      initializeSession();
    }
  }, [isTracking]);

  // Start tracking function
  const handleStartTracking = () => {
    console.log("Starting tracking...");
    setIsTracking(true);
    setFocusedTime(0);
    setTotalTime(0);
    setPeakFocus(0);
    setShowWarning(false);
    setFocusData([]);
    setSessionStartTime(new Date());
  };

  // Stop tracking function
  // const handleStopTracking = () => {
  //   // Make sure to update focus score one last time before sending
  //   const finalScore = calculateFocusScore(focusedTime, totalTime);
  //   setFocusScore(finalScore);
    
  //   // Now end the session with the updated values
  //   endSession();
  //   setIsTracking(false);
    
  //   if (camera) camera.stop();
  //   if (webcamRef.current && webcamRef.current.video && webcamRef.current.video.srcObject) {
  //     webcamRef.current.video.srcObject.getTracks().forEach((track) => track.stop());
  //   }
  // };

  const handleStopTracking = async () => {
    // Make sure to update focus score one last time before sending
    const finalScore = calculateFocusScore(focusedTime, totalTime);
    setFocusScore(finalScore);
    
    // Wait for the end session to complete
    await endSession();
    setIsTracking(false);
    
    if (camera) camera.stop();
    if (webcamRef.current && webcamRef.current.video && webcamRef.current.video.srcObject) {
      webcamRef.current.video.srcObject.getTracks().forEach((track) => track.stop());
    }
  };

  // Function to format time in minutes and seconds
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="App relative w-full h-screen overflow-hidden bg-gray-900">
      {/* Webcam Feed */}
      <Webcam
        ref={webcamRef}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
        width={640}
        height={480}
      />

      {/* Canvas for Overlays */}
      <canvas
        ref={canvasRef}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
        width={640}
        height={480}
      />

      {/* Topic Input - Only show when not tracking */}
      {!isTracking && (
        <div className="absolute top-8 left-8 z-30 bg-black bg-opacity-70 text-white p-4 rounded-lg shadow-lg">
          <label htmlFor="topic" className="block text-lg font-semibold mb-2">
            Study Topic:
          </label>
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter topic (e.g., Calculus, Physics)"
            className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
          />
        </div>
      )}

      {/* Focus Status and Controls */}
      <div className="absolute bottom-8 left-8 z-30 bg-black bg-opacity-70 text-white p-4 rounded-lg shadow-lg">
        <p className="text-lg font-semibold">
          Focus Status: <span className={isFocused ? "text-green-400" : "text-red-400"}>
            {isFocused ? "Focused" : "Distracted"}
          </span>
        </p>
        <p className="text-lg font-semibold">Focus Score: {focusScore}%</p>
        {isTracking && (
          <p className="text-lg font-semibold">Topic: {topic || "Study Session"}</p>
        )}
        {!isTracking ? (
          <button
            onClick={handleStartTracking}
            className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Start Tracking
          </button>
        ) : (
          <button
            onClick={handleStopTracking}
            className="mt-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Stop Tracking
          </button>
        )}
      </div>

      {/* Stats Card */}
      <div className="absolute top-8 right-8 z-30 bg-black bg-opacity-70 text-white p-4 rounded-lg shadow-lg">
        <p className="text-lg font-semibold">Peak Focus: {peakFocus}%</p>
        <p className="text-lg font-semibold">Duration: {formatTime(totalTime)}</p>
        <p className="text-lg font-semibold">Focused Time: {formatTime(focusedTime)}</p>
      </div>

      {/* Optimal Time Card */}
      {optimalTime && (
        <div className="absolute top-40 right-8 z-30 bg-black bg-opacity-70 text-white p-4 rounded-lg shadow-lg">
          <p className="text-lg font-semibold">Optimal Study Time: {optimalTime}</p>
        </div>
      )}

      {/* Focus Drop Warning */}
      {showWarning && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 bg-red-500 text-white p-4 rounded-lg shadow-lg">
          <p className="text-lg font-semibold">Warning: Focus Dropping!</p>
          <p>Take a short break or adjust your environment</p>
        </div>
      )}

      {/* Focus History Summary - Show when not tracking */}
      {!isTracking && focusHistory.length > 0 && (
        <div className="absolute bottom-8 right-8 z-30 bg-black bg-opacity-70 text-white p-4 rounded-lg shadow-lg max-w-xs overflow-y-auto max-h-64">
          <p className="text-lg font-semibold mb-2">Previous Sessions:</p>
          {focusHistory.slice(0, 3).map((session, index) => (
            <div key={index} className="mb-2 border-b border-gray-600 pb-2">
              <p><span className="font-medium">Topic:</span> {session.topic || "Study Session"}</p>
              <p><span className="font-medium">Date:</span> {new Date(session.start_time).toLocaleDateString()}</p>
              <p><span className="font-medium">Score:</span> {session.focus_score}%</p>
              <p><span className="font-medium">Duration:</span> {formatTime(session.total_time)}</p>
            </div>
          ))}
          {focusHistory.length > 3 && (
            <p className="text-sm italic">+ {focusHistory.length - 3} more sessions</p>
          )}
        </div>
      )}

      {/* Debug Info - Only visible in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute left-8 top-40 z-30 bg-black bg-opacity-70 text-white p-2 text-xs rounded-lg">
          <p>Session ID: {sessionId || 'None'}</p>
          <p>User ID: {userId}</p>
          <p>API Data Points: {focusData.length}</p>
          <p>Current Focus Score: {focusScore}%</p>
          <p>Focused Time: {focusedTime}s</p>
          <p>Total Time: {totalTime}s</p>
        </div>
      )}
    </div>
  );
}

export default FocusTrackingPage;