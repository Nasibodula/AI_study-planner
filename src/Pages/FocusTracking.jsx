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
  // const detectFocus = (landmarks) => {
  //   if (!landmarks) return false;
  
  //   // Get relevant landmarks
  //   const leftEye = landmarks[159]; // Left eye landmark
  //   const rightEye = landmarks[386]; // Right eye landmark
  //   const noseTip = landmarks[1]; // Nose tip landmark
  //   const leftEyeInner = landmarks[145]; // Left eye inner corner
  //   const rightEyeInner = landmarks[374]; // Right eye inner corner
  
  //   // Calculate eye position relative to the nose
  //   const eyeDistance = Math.abs(leftEye.x - rightEye.x);
  //   const eyeNoseDistance = Math.abs((leftEye.y + rightEye.y) / 2 - noseTip.y);
  
  //   // Calculate the horizontal position of the iris within the eye
  //   const leftIrisPosition = Math.abs(leftEye.x - leftEyeInner.x);
  //   const rightIrisPosition = Math.abs(rightEye.x - rightEyeInner.x);
  
  //   // Focus condition: Eyes are aligned and looking forward
  //   const isAligned = eyeDistance < 0.1 && eyeNoseDistance < 0.2;
  //   const isLookingForward = leftIrisPosition < 0.05 && rightIrisPosition < 0.05;
  
  //   return isAligned && isLookingForward;
  // };

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

  // Focus condition: Eyes are looking at the screen (forward)
  // Current condition is backward - when irises are centered and eyes aligned, 
  // the person is actually looking at the screen
  const isAligned = eyeDistance > 0.05 && eyeDistance < 0.2; // Eyes should be reasonably aligned
  const isLookingForward = Math.abs(leftIrisPosition - rightIrisPosition) < 0.02; // Irises should be symmetrical
  
  // When looking at screen, iris is typically centered, not at edge
  const eyesCentered = (leftIrisPosition > 0.01 && leftIrisPosition < 0.04) && 
                        (rightIrisPosition > 0.01 && rightIrisPosition < 0.04);
  
  return isAligned && isLookingForward && eyesCentered;
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