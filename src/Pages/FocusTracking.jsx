import { useRef, useEffect, useState } from 'react';
import { FaceMesh } from '@mediapipe/face_mesh';
import * as Facemesh from '@mediapipe/face_mesh';
import * as cam from '@mediapipe/camera_utils';
import { drawConnectors } from '@mediapipe/drawing_utils';
import Webcam from 'react-webcam';

function FocusTrackingPage() {

  const startTracking = () => {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage('startTracking');
    }
  };

  const stopTracking = () => {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage('stopTracking');
    }
  };

  useEffect(() => {
    startTracking();
    return () => {
      stopTracking();
    };
  }, []);
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
  var camera = null;

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

    // Update peak focus
    if (score > peakFocus) {
      setPeakFocus(score);
    }

    // Detect drastic focus drop
    if (peakFocus - score > 20) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  }, [focusedTime, totalTime]);

  const handleStartTracking = () => {
    setIsTracking(true);
    setFocusedTime(0);
    setTotalTime(0);
    setPeakFocus(0); // Reset peak focus on start
    setShowWarning(false); // Reset warning on start
  };

  const handleStopTracking = () => {
    setIsTracking(false);
    if (camera) camera.stop();
    if (webcamRef.current && webcamRef.current.video) {
      webcamRef.current.video.srcObject.getTracks().forEach((track) => track.stop());
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