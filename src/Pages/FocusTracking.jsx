// import { useRef, useEffect, useState } from 'react';
// import { FaceMesh } from '@mediapipe/face_mesh';
// import * as Facemesh from '@mediapipe/face_mesh';
// import * as cam from '@mediapipe/camera_utils';
// import { drawConnectors } from '@mediapipe/drawing_utils';
// import Webcam from 'react-webcam';

// function FocusTrackingPage() {

//   const startTracking = () => {
//     if (navigator.serviceWorker.controller) {
//       navigator.serviceWorker.controller.postMessage('startTracking');
//     }
//   };

//   const stopTracking = () => {
//     if (navigator.serviceWorker.controller) {
//       navigator.serviceWorker.controller.postMessage('stopTracking');
//     }
//   };

//   useEffect(() => {
//     startTracking();
//     return () => {
//       stopTracking();
//     };
//   }, []);
//   // Setup references
//   const webcamRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [isTracking, setIsTracking] = useState(false);
//   const [isFocused, setIsFocused] = useState(true);
//   const [focusScore, setFocusScore] = useState(0);
//   const [focusedTime, setFocusedTime] = useState(0);
//   const [totalTime, setTotalTime] = useState(0);
//   const [peakFocus, setPeakFocus] = useState(0); // Track peak focus score
//   const [showWarning, setShowWarning] = useState(false); // Show focus drop warning
//   var camera = null;

//   // Function to calculate focus score
//   const calculateFocusScore = (focusedTime, totalTime) => {
//     return totalTime === 0 ? 0 : ((focusedTime / totalTime) * 100).toFixed(2);
//   };

//   // Function to detect focus
//   const detectFocus = (landmarks) => {
//     if (!landmarks) return false;
  
//     // Get relevant landmarks
//     const leftEye = landmarks[159]; // Left eye landmark
//     const rightEye = landmarks[386]; // Right eye landmark
//     const noseTip = landmarks[1]; // Nose tip landmark
//     const leftEyeInner = landmarks[145]; // Left eye inner corner
//     const rightEyeInner = landmarks[374]; // Right eye inner corner
  
//     // Calculate eye position relative to the nose
//     const eyeDistance = Math.abs(leftEye.x - rightEye.x);
//     const eyeNoseDistance = Math.abs((leftEye.y + rightEye.y) / 2 - noseTip.y);
  
//     // Calculate the horizontal position of the iris within the eye
//     const leftIrisPosition = Math.abs(leftEye.x - leftEyeInner.x);
//     const rightIrisPosition = Math.abs(rightEye.x - rightEyeInner.x);
  
//     // Focus condition: Eyes are aligned and looking forward
//     const isAligned = eyeDistance < 0.1 && eyeNoseDistance < 0.2;
//     const isLookingForward = leftIrisPosition < 0.05 && rightIrisPosition < 0.05;
//       // When looking at screen, iris is typically centered, not at edge
//   const eyesCentered = (leftIrisPosition > 0.01 && leftIrisPosition < 0.04) && 
//   (rightIrisPosition > 0.01 && rightIrisPosition < 0.04);
  
//     return isAligned && isLookingForward;
//   };

  
//   const onResults = async (results) => {
//     const canvasElement = canvasRef.current;
//     const canvasCtx = canvasElement.getContext("2d");

//     // Clear canvas and draw video frame
//     canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
//     canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

//     // Draw face mesh landmarks
//     if (results.multiFaceLandmarks) {
//       for (const landmarks of results.multiFaceLandmarks) {
//         drawConnectors(canvasCtx, landmarks, Facemesh.FACEMESH_TESSELATION, { color: '#C0C0C070', lineWidth: 0.5 });
//         drawConnectors(canvasCtx, landmarks, Facemesh.FACEMESH_RIGHT_EYE, { color: '#C0C0C070' });
//         drawConnectors(canvasCtx, landmarks, Facemesh.FACEMESH_RIGHT_IRIS, { color: '#C0C0C070' });
//         drawConnectors(canvasCtx, landmarks, Facemesh.FACEMESH_LEFT_EYE, { color: '#C0C0C070' });
//         drawConnectors(canvasCtx, landmarks, Facemesh.FACEMESH_LEFT_IRIS, { color: '#30FF30' });
//         drawConnectors(canvasCtx, landmarks, Facemesh.FACEMESH_FACE_OVAL, { color: '#C0C0C070' });
//         drawConnectors(canvasCtx, landmarks, Facemesh.FACEMESH_LIPS, { color: '#C0C0C070' });

//         // Detect focus
//         const focused = detectFocus(landmarks);
//         setIsFocused(focused);
//       }
//     }
//   };

//   useEffect(() => {
//     if (!isTracking) return;

//     const faceMesh = new FaceMesh({ locateFile: (file) => {
//       return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
//     }});

//     faceMesh.setOptions({
//       maxNumFaces: 1,
//       minDetectionConfidence: 0.5,
//       minTrackingConfidence: 0.5,
//     });

//     faceMesh.onResults(onResults);

//     if (webcamRef.current && webcamRef.current.video) {
//       camera = new cam.Camera(webcamRef.current.video, {
//         onFrame: async () => {
//           await faceMesh.send({ image: webcamRef.current.video });
//         },
//         width: 640,
//         height: 480,
//       });
//       camera.start();
//     }

//     return () => {
//       if (camera) camera.stop();
//     };
//   }, [isTracking]);

//   useEffect(() => {
//     let timer;
//     if (isTracking) {
//       timer = setInterval(() => {
//         setTotalTime((prev) => prev + 1);
//         if (isFocused) {
//           setFocusedTime((prev) => prev + 1);
//         }
//       }, 1000); // Update every second
//     }
//     return () => clearInterval(timer);
//   }, [isTracking, isFocused]);

//   useEffect(() => {
//     const score = calculateFocusScore(focusedTime, totalTime);
//     setFocusScore(score);

//     // Update peak focus
//     if (score > peakFocus) {
//       setPeakFocus(score);
//     }

//     // Detect drastic focus drop
//     if (peakFocus - score > 20) {
//       setShowWarning(true);
//     } else {
//       setShowWarning(false);
//     }
//   }, [focusedTime, totalTime]);

//   const handleStartTracking = () => {
//     setIsTracking(true);
//     setFocusedTime(0);
//     setTotalTime(0);
//     setPeakFocus(0); // Reset peak focus on start
//     setShowWarning(false); // Reset warning on start
//   };

//   const handleStopTracking = () => {
//     setIsTracking(false);
//     if (camera) camera.stop();
//     if (webcamRef.current && webcamRef.current.video) {
//       webcamRef.current.video.srcObject.getTracks().forEach((track) => track.stop());
//     }
//   };

//   return (
//     <div className="App relative w-full h-screen overflow-hidden bg-gray-900">
//       {/* Webcam Feed */}
//       <Webcam
//         ref={webcamRef}
//         className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
//         width={640}
//         height={480}
//       />

//       {/* Canvas for Overlays */}
//       <canvas
//         ref={canvasRef}
//         className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
//         width={640}
//         height={480}
//       />

//       {/* Focus Status and Controls */}
//       <div className="absolute bottom-8 left-8 z-30 bg-black bg-opacity-70 text-white p-4 rounded-lg shadow-lg">
//         <p className="text-lg font-semibold">
//           Focus Status: <span className={isFocused ? "text-green-400" : "text-red-400"}>
//             {isFocused ? "Focused" : "Distracted"}
//           </span>
//         </p>
//         <p className="text-lg font-semibold">Focus Score: {focusScore}%</p>
//         {!isTracking ? (
//           <button
//             onClick={handleStartTracking}
//             className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
//           >
//             Start Tracking
//           </button>
//         ) : (
//           <button
//             onClick={handleStopTracking}
//             className="mt-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
//           >
//             Stop Tracking
//           </button>
//         )}
//       </div>

//       {/* Peak Focus Card */}
//       <div className="absolute top-8 right-8 z-30 bg-black bg-opacity-70 text-white p-4 rounded-lg shadow-lg">
//         <p className="text-lg font-semibold">Peak Focus: {peakFocus}%</p>
//       </div>

//       {/* Duration Card */}
//       <div className="absolute top-24 right-8 z-30 bg-black bg-opacity-70 text-white p-4 rounded-lg shadow-lg">
//         <p className="text-lg font-semibold">Duration: {totalTime}s</p>
//       </div>

//       {/* Focus Drop Warning */}
//       {showWarning && (
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 bg-red-500 text-white p-4 rounded-lg shadow-lg">
//           <p className="text-lg font-semibold">Warning: Focus Dropping!</p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default FocusTrackingPage;


import { useRef, useEffect, useState } from 'react';
import { FaceMesh } from '@mediapipe/face_mesh';
import * as Facemesh from '@mediapipe/face_mesh';
import * as cam from '@mediapipe/camera_utils';
import { drawConnectors } from '@mediapipe/drawing_utils';
import Webcam from 'react-webcam';
import axios from 'axios'; // Make sure axios is installed
// At the top of your FocusTrackingPage component file
import { authService } from '../services/authService';

// const api = axios.create({
//   baseURL: 'http://localhost:5000',
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json'
//   }
// });
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

function FocusTrackingPage() {
  // Setup references
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [isTracking, setIsTracking] = useState(false);
  const [isFocused, setIsFocused] = useState(true);
  const [focusScore, setFocusScore] = useState(0);
  const [focusedTime, setFocusedTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [peakFocus, setPeakFocus] = useState(0); // Track peak focus score
  const [showWarning, setShowWarning] = useState(false); // Show focus drop warning
  const [sessionId, setSessionId] = useState(null);
  const [distractionCount, setDistractionCount] = useState(0);
  const [lastFocusState, setLastFocusState] = useState(true);
  const [attentionSpans, setAttentionSpans] = useState([]);
  const [currentSpanStart, setCurrentSpanStart] = useState(null);
  var camera = null;
  const cameraRef = useRef(null);

  // Add this at the top of your StudyPlannerPage component
  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   console.log('Current auth token:', token);
    
  //   if (token) {
  //     api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  //     console.log('Authorization header set:', api.defaults.headers.common['Authorization']);
  //   } else {
  //     console.log('No auth token found');
  //   }
  // }, []);
  useEffect(() => {
    const token = authService.getToken(); // Use your auth service
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  // Generate a unique session ID when tracking starts
  const generateSessionId = () => {
    return `session_${Date.now()}`;
  };

  const startTracking = () => {
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage('startTracking');
    }
  };

  const stopTracking = () => {
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage('stopTracking');
    }
  };

  // Send focus data to backend
  // const sendFocusData = async (isFinalRecord = false) => {
  //   try {
  //     // Calculate average attention span in minutes
  //     const avgAttentionSpan = attentionSpans.length > 0 
  //       ? (attentionSpans.reduce((sum, span) => sum + span, 0) / attentionSpans.length) / 60 
  //       : (focusedTime / totalTime) * (totalTime / 60);
      
  //     const focusData = {
  //       _key: `focus_${Date.now()}`,
  //       session_id: sessionId,
  //       timestamp: new Date().toISOString(),
  //       focus_score: parseInt(focusScore),
  //       distraction_count: distractionCount,
  //       attention_span: parseFloat(avgAttentionSpan.toFixed(2)),
  //       user_id: "user_1", // Replace with actual user authentication
  //       is_final_record: isFinalRecord
  //     };
      
  //     // Send data to your backend API
  //     await axios.post('/api/focus-data', focusData);
  //     console.log('Focus data sent successfully', focusData);
  //   } catch (error) {
  //     console.error('Failed to send focus data:', error);
  //   }
  // };

  // Add API URL configuration
// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Update the sendFocusData function
// Update the sendFocusData function
// const sendFocusData = async (isFinalRecord = false) => {
//   try {
//     // Calculate average attention span in minutes
//     const avgAttentionSpan = attentionSpans.length > 0 
//       ? (attentionSpans.reduce((sum, span) => sum + span, 0) / attentionSpans.length) / 60 
//       : (focusedTime / totalTime) * (totalTime / 60);
//       const user_id = localStorage.getItem('userId');
      
//       if (!user_id) {
//         throw new Error('User ID not found. Please log in again.');
//       }
    
//     const focusData = {
//       _key: `focus_${Date.now()}`,
//       session_id: sessionId,
//       timestamp: new Date().toISOString(),
//       focus_score: parseInt(focusScore),
//       distraction_count: distractionCount,
//       attention_span: parseFloat(avgAttentionSpan.toFixed(2)),
//       user_id:  user_id, // Replace with actual user authentication
//       is_final_record: isFinalRecord
//     };
    
//     console.log('Sending focus data:', focusData);
    
//     // Use the configured api client instead of axios directly
//     const response = await api.post(`/api/focus-data`, focusData);
//     console.log('Focus data sent successfully', response.data);
    
//     return response.data;
//   } catch (error) {
//     console.error('Failed to send focus data:', error.message);
//     if (error.response) {
//       console.error('Server response:', error.response.data);
//     }
//     return null;
//   }
// };

const sendFocusData = async (isFinalRecord = false) => {
  try {
    // Calculate average attention span in minutes
    const avgAttentionSpan = attentionSpans.length > 0 
      ? (attentionSpans.reduce((sum, span) => sum + span, 0) / attentionSpans.length) / 60 
      : (focusedTime / totalTime) * (totalTime / 60);
    
    const user = authService.getCurrentUser();
    const user_id = user?.id || localStorage.getItem('userId');
      
    if (!user_id) {
      throw new Error('User ID not found. Please log in again.');
    }
    
    const focusData = {
      _key: `focus_${Date.now()}`,
      session_id: sessionId,
      timestamp: new Date().toISOString(),
      focus_score: parseInt(focusScore),
      distraction_count: distractionCount,
      attention_span: parseFloat(avgAttentionSpan.toFixed(2)),
      user_id: user_id,
      is_final_record: isFinalRecord
    };
    
    console.log('Sending focus data:', focusData);
    
    // Use the configured api client
    const response = await api.post(`/api/focus-data`, focusData);
    console.log('Focus data sent successfully', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Failed to send focus data:', error.message);
    if (error.response) {
      console.error('Server response:', error.response.data);
    }
    return null;
  }
};

  useEffect(() => {
    startTracking();
    return () => {
      stopTracking();
    };
  }, []);

  // Function to calculate focus score
  const calculateFocusScore = (focusedTime, totalTime) => {
    return totalTime === 0 ? 0 : ((focusedTime / totalTime) * 100).toFixed(2);
  };

  // Function to detect focus
  const detectFocus = (landmarks) => {
    if (!landmarks) return false;
  
    // Get relevant landmarks
    const leftEye = landmarks[159]; // Left eye landmark
    const rightEye = landmarks[386]; // Right eye landmark
    const noseTip = landmarks[1]; // Nose tip landmark
    const leftEyeInner = landmarks[145]; // Left eye inner corner
    const rightEyeInner = landmarks[374]; // Right eye inner corner
  
    // Calculate eye position relative to the nose
    const eyeDistance = Math.abs(leftEye.x - rightEye.x);
    const eyeNoseDistance = Math.abs((leftEye.y + rightEye.y) / 2 - noseTip.y);
  
    // Calculate the horizontal position of the iris within the eye
    const leftIrisPosition = Math.abs(leftEye.x - leftEyeInner.x);
    const rightIrisPosition = Math.abs(rightEye.x - rightEyeInner.x);
  
    // Focus condition: Eyes are aligned and looking forward
    const isAligned = eyeDistance < 0.1 && eyeNoseDistance < 0.2;
    const isLookingForward = leftIrisPosition < 0.05 && rightIrisPosition < 0.05;
    
    // When looking at screen, iris is typically centered, not at edge
    const eyesCentered = (leftIrisPosition > 0.01 && leftIrisPosition < 0.04) && 
    (rightIrisPosition > 0.01 && rightIrisPosition < 0.04);
  
    return isAligned && isLookingForward ;
  };

  const onResults = async (results) => {
    const canvasElement = canvasRef.current;
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

  useEffect(() => {
    if (!isTracking) return;

    const faceMesh = new FaceMesh({ locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
    }});

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

  // Track attention spans
  useEffect(() => {
    if (!isTracking) return;
    
    // If focus state changed
    if (isFocused !== lastFocusState) {
      // If previously focused and now distracted, end the attention span
      if (!isFocused && lastFocusState) {
        if (currentSpanStart !== null) {
          const spanDuration = totalTime - currentSpanStart;
          setAttentionSpans(prev => [...prev, spanDuration]);
          setCurrentSpanStart(null);
        }
        // Count as a distraction
        setDistractionCount(prev => prev + 1);
      } 
      // If was distracted and now focused, start a new attention span
      else if (isFocused && !lastFocusState) {
        setCurrentSpanStart(totalTime);
      }
      
      setLastFocusState(isFocused);
    }
  }, [isFocused, isTracking, lastFocusState, totalTime, currentSpanStart]);

  // Timer for tracking
  useEffect(() => {
    let timer;
    if (isTracking) {
      timer = setInterval(() => {
        setTotalTime((prev) => prev + 1);
        if (isFocused) {
          setFocusedTime((prev) => prev + 1);
        }
        
        // Send periodic data every 30 seconds
        if (totalTime > 0 && totalTime % 30 === 0) {
          sendFocusData(false);
        }
      }, 1000); // Update every second
    }
    return () => clearInterval(timer);
  }, [isTracking, isFocused, totalTime]);

  // Focus score calculation
  useEffect(() => {
    const score = calculateFocusScore(focusedTime, totalTime);
    setFocusScore(score);

    // Update peak focus
    if (parseFloat(score) > parseFloat(peakFocus)) {
      setPeakFocus(score);
    }

    // Detect drastic focus drop
    if (parseFloat(peakFocus) - parseFloat(score) > 20) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  }, [focusedTime, totalTime, peakFocus]);

  const handleStartTracking = () => {
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
    setIsTracking(true);
    setFocusedTime(0);
    setTotalTime(0);
    setPeakFocus(0); // Reset peak focus on start
    setShowWarning(false); // Reset warning on start
    setDistractionCount(0); // Reset distraction count
    setAttentionSpans([]); // Reset attention spans
    setCurrentSpanStart(0); // Start tracking attention span
  };

  const handleStopTracking = () => {
    setIsTracking(false);
    if (camera) camera.stop();
    
    // Send final focus data
    sendFocusData(true);
    
    // Clean up video tracks
    if (webcamRef.current && webcamRef.current.video && webcamRef.current.video.srcObject) {
      webcamRef.current.video.srcObject.getTracks().forEach((track) => track.stop());
    }
  };


  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Current token:', token);
      
      // Try to make a request to an endpoint that requires authentication
      const response = await api.get('/api/auth/user');
      console.log('Authentication check successful:', response.data);
      return true;
    } catch (err) {
      console.error('Authentication check failed:', err.response?.data || err.message);
      return false;
    }
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

      {/* Focus Status and Controls */}
      <div className="absolute bottom-8 left-8 z-30 bg-black bg-opacity-70 text-white p-4 rounded-lg shadow-lg">
        <p className="text-lg font-semibold">
          Focus Status: <span className={isFocused ? "text-green-400" : "text-red-400"}>
            {isFocused ? "Focused" : "Distracted"}
          </span>
        </p>
        <p className="text-lg font-semibold">Focus Score: {focusScore}%</p>
        <p className="text-lg font-semibold">Distractions: {distractionCount}</p>
        
        {sessionId && <p className="text-sm text-gray-300">Session ID: {sessionId}</p>}
        
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

      {/* Peak Focus Card */}
      <div className="absolute top-8 right-8 z-30 bg-black bg-opacity-70 text-white p-4 rounded-lg shadow-lg">
        <p className="text-lg font-semibold">Peak Focus: {peakFocus}%</p>
      </div>

      {/* Duration Card */}
      <div className="absolute top-24 right-8 z-30 bg-black bg-opacity-70 text-white p-4 rounded-lg shadow-lg">
        <p className="text-lg font-semibold">Duration: {totalTime}s</p>
        <p className="text-sm">Focused Time: {focusedTime}s</p>
        
        {attentionSpans.length > 0 && (
          <p className="text-sm">
            Avg Attention Span: {(attentionSpans.reduce((sum, span) => sum + span, 0) / attentionSpans.length).toFixed(1)}s
          </p>
        )}
      </div>

      {/* Focus Drop Warning */}
      {showWarning && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 bg-red-500 text-white p-4 rounded-lg shadow-lg">
          <p className="text-lg font-semibold">Warning: Focus Dropping!</p>
        </div>
      )}
    </div>
  );
}

export default FocusTrackingPage;