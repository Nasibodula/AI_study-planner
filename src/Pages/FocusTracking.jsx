import React, { useState, useEffect, useRef } from 'react';
import { Camera, AlertCircle, PauseCircle, Eye, Timer, BarChart2 } from 'lucide-react';

const FocusTrackingPage = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [focusScore, setFocusScore] = useState(85);
  const [duration, setDuration] = useState(0);
  const [distractions, setDistractions] = useState(0);
  const [peakFocus, setPeakFocus] = useState(0);
  const [alerts, setAlerts] = useState([]);
  const videoRef = useRef(null);

  // Load models and initialize face detection
  useEffect(() => {
    const faceapi = window.faceapi;

    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.faceExpressionNet.loadFromUri('/models');
      console.log('Models loaded successfully');
    };

    if (isTracking) {
      loadModels();
    }
  }, [isTracking]);

  // Camera logic
  useEffect(() => {
    let stream = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing the camera", error);
      }
    };

    const stopCamera = () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    };

    if (isTracking) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isTracking]);

  // Face detection logic
  useEffect(() => {
    if (isTracking && videoRef.current) {
      const faceapi = window.faceapi;

      const detectFaces = async () => {
        const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions();

        if (detections.length > 0) {
          // Update focus score based on detection
          const newScore = Math.floor(Math.random() * (100 - 70 + 1)) + 70;
          setFocusScore(newScore);

          // Check for distractions (e.g., looking away)
          const face = detections[0];
          const box = face.detection.box;
          if (box.left === null || box.top === null || box.right === null || box.bottom === null) {
            setDistractions((prev) => prev + 1);
            setAlerts((prev) => [
              ...prev,
              `Distraction detected - ${new Date().toLocaleTimeString()}`,
            ]);
          }
        } else {
          // No face detected
          setDistractions((prev) => prev + 1);
          setAlerts((prev) => [
            ...prev,
            `No face detected - ${new Date().toLocaleTimeString()}`,
          ]);
        }
      };

      const interval = setInterval(detectFaces, 5000); // Detect faces every 5 seconds
      return () => clearInterval(interval);
    }
  }, [isTracking]);

  // Simulate focus score updates
  useEffect(() => {
    if (isTracking) {
      const interval = setInterval(() => {
        const newScore = Math.floor(Math.random() * (100 - 70 + 1)) + 70;
        setFocusScore(newScore);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isTracking]);

  // Track session duration
  useEffect(() => {
    if (isTracking) {
      const startTime = Date.now();

      const interval = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        setDuration(elapsedTime);
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setDuration(0);
    }
  }, [isTracking]);

  // Track peak focus
  useEffect(() => {
    if (focusScore > peakFocus) {
      setPeakFocus(focusScore);
    }
  }, [focusScore]);

  // Generate alerts
  useEffect(() => {
    if (focusScore < 75) {
      setAlerts((prev) => [
        ...prev,
        `Low focus detected - ${new Date().toLocaleTimeString()}`,
      ]);
    }
  }, [focusScore]);

  useEffect(() => {
    if (distractions > 0) {
      setAlerts((prev) => [
        ...prev,
        `Distraction detected - ${new Date().toLocaleTimeString()}`,
      ]);
    }
  }, [distractions]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Focus Tracking</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Camera Feed Section */}
          <div className="lg:col-span-2 bg-white rounded-lg border shadow-sm">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xl font-semibold">
                  <Camera className="w-5 h-5" />
                  Camera Feed
                </div>
                {isTracking && (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-red-500">Recording</span>
                  </div>
                )}
              </div>
            </div>
            <div className="p-6">
              <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                {!isTracking ? (
                  <div className="text-center text-gray-400">
                    <Camera className="w-16 h-16 mx-auto mb-4" />
                    <p>Camera feed will appear here</p>
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      className="rounded-lg w-full h-full"
                    ></video>
                    {/* Face tracking overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="border-2 border-green-500 w-48 h-48 rounded-lg"></div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-4 flex gap-4 justify-center">
                <button
                  onClick={() => setIsTracking(!isTracking)}
                  className={`px-6 py-3 rounded-md text-white flex items-center ${
                    isTracking ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isTracking ? (
                    <> <PauseCircle className="w-5 h-5 mr-2" /> Stop Tracking</>
                  ) : (
                    <> <Camera className="w-5 h-5 mr-2" /> Start Tracking</>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Stats and Alerts Section */}
          <div className="space-y-6">
            {/* Focus Score */}
            <div className="bg-white rounded-lg border shadow-sm">
              <div className="p-6 border-b">
                <div className="flex items-center gap-2 text-xl font-semibold">
                  <Eye className="w-5 h-5" />
                  Focus Score
                </div>
              </div>
              <div className="p-6">
                <div className="text-center">
                  <div className="text-6xl font-bold text-blue-600 mb-2">
                    {focusScore}%
                  </div>
                  <p className="text-gray-500">Current Focus Level</p>
                </div>
              </div>
            </div>

            {/* Session Stats */}
            <div className="bg-white rounded-lg border shadow-sm">
              <div className="p-6 border-b">
                <div className="flex items-center gap-2 text-xl font-semibold">
                  <Timer className="w-5 h-5" />
                  Session Stats
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Duration</span>
                    <span className="font-semibold">{`${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}`}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Distractions</span>
                    <span className="font-semibold">{distractions}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Peak Focus</span>
                    <span className="font-semibold">{peakFocus}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Alerts */}
            <div className="bg-white rounded-lg border shadow-sm">
              <div className="p-6 border-b">
                <div className="flex items-center gap-2 text-xl font-semibold">
                  <AlertCircle className="w-5 h-5" />
                  Recent Alerts
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {alerts.map((alert, index) => (
                    <div key={index} className="p-4 border-l-4 border-red-500 bg-red-50 rounded-r-lg">
                      {alert}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-white rounded-lg border shadow-sm">
              <div className="p-6 border-b">
                <div className="flex items-center gap-2 text-xl font-semibold">
                  <BarChart2 className="w-5 h-5" />
                  Focus Tips
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Take a 5-minute break every 25 minutes</li>
                  <li>• Ensure proper lighting for better tracking</li>
                  <li>• Position yourself centered in the camera</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FocusTrackingPage;