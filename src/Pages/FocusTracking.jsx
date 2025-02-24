// import React, { useState } from "react";
// import FocusTracker from "../components/FocusTracker";
// import DistractionAlert from "../components/DistractionAlert";
// import FocusScore from "../components/FocusScore";
// import SessionReport from "../components/SessionReport";

// const FocusTrackingPage = () => {
//   const [isFocused, setIsFocused] = useState(true);
//   const [focusScore, setFocusScore] = useState(0); // Example score
//   const [sessions, setSessions] = useState([
//     { focusScore: 90 },
//     { focusScore: 80 },
//     { focusScore: 75 },
//   ]);

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <h1 className="text-3xl font-bold mb-8">AI-Powered Focus Tracking</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         <FocusTracker />
//         <FocusScore score={focusScore} />
//         <SessionReport sessions={sessions} />
//       </div>
//       <DistractionAlert isFocused={isFocused} />
//     </div>
//   );
// };

// export default FocusTrackingPage;


// import React, { useEffect, useRef, useState } from "react";
// import { FaceMesh } from "@mediapipe/face_mesh";
// import * as cam from "@mediapipe/camera_utils";
// import * as tf from "@tensorflow/tfjs";
// import "@tensorflow/tfjs-backend-webgl"; // Ensure WebGL backend is loaded

// const FocusTrackingPage = () => {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [focusScore, setFocusScore] = useState(100);
//   const [distractionCount, setDistractionCount] = useState(0);
//   const [isDistracted, setIsDistracted] = useState(false);
//   const distractionThreshold = 5; // Number of frames before marking as distracted
//   let distractionFrames = 0;

//   videoRef.current.style.display = "block";


//   useEffect(() => {
//     let camera;
    
//     async function initTracking() {
//       // ✅ Ensure TensorFlow is ready before running
//       await tf.setBackend("webgl");
//       await tf.ready();
//       console.log("✅ Using WebGL backend");

//       // ✅ Initialize MediaPipe FaceMesh
//       const faceMesh = new FaceMesh({
//         locateFile: (file) =>
//           `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}?v=${Date.now()}`, // Cache busting
//       });

//       faceMesh.setOptions({
//         maxNumFaces: 1,
//         refineLandmarks: true,
//         minDetectionConfidence: 0.5,
//         minTrackingConfidence: 0.5,
//       });

//       faceMesh.onResults((results) => {
//         const canvasCtx = canvasRef.current.getContext("2d");
//         canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

//         if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
//           const landmarks = results.multiFaceLandmarks[0];

//           // Get eye landmarks (right eye: 33, 133 | left eye: 362, 263)
//           const rightEye = landmarks[33];
//           const leftEye = landmarks[362];

//           // Check if user is looking straight (based on x-coordinates of eyes)
//           const isLookingStraight = Math.abs(rightEye.x - leftEye.x) < 0.06;

//           if (isLookingStraight) {
//             distractionFrames = 0;
//             if (isDistracted) {
//               setIsDistracted(false);
//             }
//           } else {
//             distractionFrames++;
//             if (distractionFrames >= distractionThreshold) {
//               if (!isDistracted) {
//                 setDistractionCount((prev) => prev + 1);
//                 setIsDistracted(true);
//               }
//             }
//           }

//           // Update focus score (reduce score if distracted)
//           setFocusScore((prevScore) =>
//             isDistracted ? Math.max(prevScore - 1, 0) : Math.min(prevScore + 1, 100)
//           );

//           // 🎨 Draw face landmarks on canvas
//           landmarks.forEach((landmark) => {
//             const x = landmark.x * canvasRef.current.width;
//             const y = landmark.y * canvasRef.current.height;
//             canvasCtx.beginPath();
//             canvasCtx.arc(x, y, 2, 0, 2 * Math.PI);
//             canvasCtx.fillStyle = "red";
//             canvasCtx.fill();
//           });
//         }
//       });

//       // ✅ Start video capture with MediaPipe camera
//       if (videoRef.current) {
//         camera = new cam.Camera(videoRef.current, {
//           onFrame: async () => {
//             await faceMesh.send({ image: videoRef.current });
//           },
//           width: 640,
//           height: 480,
//         });
//         camera.start();
//       }
//     }

//     initTracking();

//     // ✅ Clean up resources when component unmounts
//     return () => {
//       if (camera) {
//         camera.stop();
//       }
//     };
//   }, []);

//   return (
//     <div className="focus-tracker">
//       <h1>📸 AI-Powered Focus Tracking</h1>
//       <p>✅ Real-Time Attention Detection</p>
//       <p>✅ Distraction Alerts</p>
//       <p>✅ Focus Score: {focusScore}%</p>
//       <p>✅ Session Reports</p>
//       <video ref={videoRef} style={{ display: "none" }} />
//       <canvas ref={canvasRef} width={640} height={480} />
//       {isDistracted && <p style={{ color: "red" }}>⚠️ You seem distracted!</p>}
//     </div>
//   );
// };

// export default FocusTrackingPage;



// import { useRef, useEffect } from 'react';
// import { FaceMesh } from '@mediapipe/face_mesh';
// import * as Facemesh from '@mediapipe/face_mesh';
// import * as cam from '@mediapipe/camera_utils';
// import { drawConnectors } from '@mediapipe/drawing_utils';
// import Webcam from 'react-webcam';

// // import './App.css';

// function FocusTrackingPage() {
//   // Setup references
//   const webcamRef = useRef(null);
//   const canvasRef = useRef(null);
//   var camera = null;
//   const connect = window.drawConnectors;

//   const onResults = async (results) => {
//     //console.log(results);

//     // Set canvas width and height
//     canvasRef.current.width = webcamRef.current.video.videoWidth;
//     canvasRef.current.height = webcamRef.current.video.videoHeight;

//     const canvasElement = canvasRef.current;
//     const canvasCtx = canvasElement.getContext("2d");
//     canvasCtx.save();

//     canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
//     canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

//     if (results.multiFaceLandmarks){
//       for (const landmarks of results.multiFaceLandmarks) {
//         drawConnectors(canvasCtx, landmarks, Facemesh.FACEMESH_TESSELATION,
//                        {color: '#C0C0C070', lineWidth: 0.5});
//         drawConnectors(canvasCtx, landmarks, Facemesh.FACEMESH_RIGHT_EYE, {color: '#C0C0C070'});
//         drawConnectors(canvasCtx, landmarks, Facemesh.FACEMESH_RIGHT_IRIS, {color: '#C0C0C070'});
//         drawConnectors(canvasCtx, landmarks, Facemesh.FACEMESH_LEFT_EYE, {color: '#C0C0C070'});
//         drawConnectors(canvasCtx, landmarks, Facemesh.FACEMESH_LEFT_IRIS, {color: '#30FF30'});
//         drawConnectors(canvasCtx, landmarks, Facemesh.FACEMESH_FACE_OVAL, {color: '#C0C0C070'});
//         drawConnectors(canvasCtx, landmarks, Facemesh.FACEMESH_LIPS, {color: '#C0C0C070'});
//       }
//     }
//   }

//   useEffect(() => {
//     const faceMesh = new FaceMesh({locateFile: (file) => {
//       return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
//     }});

//     faceMesh.setOptions({
//       maxNumFaces: 3,
//       minDetectionConfidence: 0.5,
//       minTrackingConfidence: 0.5,
//     });

//     faceMesh.onResults(onResults);

//     if (typeof webcamRef.current !== "undefined" && webcamRef.current !== null) {
//       camera = new cam.Camera(webcamRef.current.video, {
//         onFrame:async () => {
//           await faceMesh.send({image:webcamRef.current.video})
//         },
//         width: 640,
//         height: 480
//       });
//       camera.start();
//     }
//   });


//   return (
//     <div className="App">
//       <header className='App-header'>
//         <Webcam 
//           ref={webcamRef} 
//           style={{
//             position: "absolute",
//             marginLeft: "auto",
//             marginRight: "auto",
//             left: 0,
//             right: 0,
//             textAlign: "center",
//             zIndex: 9,
//             width: 640,
//             height: 480
//           }} 
//         />   
//         <canvas 
//           ref={canvasRef} 
//           style={{
//             position: "absolute",
//             marginLeft: "auto",
//             marginRight: "auto",
//             left: 0,
//             right: 0,
//             textAlign: "center",
//             zIndex: 9,
//             width: 640,
//             height: 480
//           }} 
//         />
//       </header>
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

function FocusTrackingPage() {
  // Setup references
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [isTracking, setIsTracking] = useState(false);
  const [isFocused, setIsFocused] = useState(true);
  const [focusScore, setFocusScore] = useState(0);
  const [focusedTime, setFocusedTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  var camera = null;
  

  // Function to calculate focus score
  const calculateFocusScore = (focusedTime, totalTime) => {
    return totalTime === 0 ? 0 : ((focusedTime / totalTime) * 100).toFixed(2);
  };

  // Function to handle focus detection
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
  
    return isAligned && isLookingForward;
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

  useEffect(() => {
    let timer;
    if (isTracking) {
      timer = setInterval(() => {
        setTotalTime((prev) => prev + 1);
        if (isFocused) {
          setFocusedTime((prev) => prev + 1);
        }
      }, 1000); // Update every second
    }
    return () => clearInterval(timer);
  }, [isTracking, isFocused]);

  useEffect(() => {
    const score = calculateFocusScore(focusedTime, totalTime);
    setFocusScore(score);
  }, [focusedTime, totalTime]);

  const handleStartTracking = () => {
    setIsTracking(true);
    setFocusedTime(0);
    setTotalTime(0);
  };

  const handleStopTracking = () => {
    setIsTracking(false);
    if (camera) camera.stop();
    if (webcamRef.current && webcamRef.current.video) {
      webcamRef.current.video.srcObject.getTracks().forEach((track) => track.stop());
    }
  };

  return (
    <div className="App" style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      <Webcam
        ref={webcamRef}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 1, // Lower z-index for video
          width: 640,
          height: 480,
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 2, // Higher z-index for canvas
          width: 640,
          height: 480,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: 20,
          zIndex: 3, // Highest z-index for focus status and buttons
          color: "white",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          padding: "10px",
          borderRadius: "8px",
        }}
      >
        <p>Focus Status: {isFocused ? "Focused" : "Distracted"}</p>
        <p>Focus Score: {focusScore}%</p>
        {!isTracking ? (
          <button
            onClick={handleStartTracking}
            style={{ marginRight: 10, padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}
          >
            Start Tracking
          </button>
        ) : (
          <button
            onClick={handleStopTracking}
            style={{ padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}
          >
            Stop Tracking
          </button>
        )}
      </div>
    </div>
  );
}

export default FocusTrackingPage;