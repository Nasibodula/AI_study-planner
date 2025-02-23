// import { useState, useEffect, useRef } from 'react';
// import FocusTrackingService from '../services/FocusTrackingService';
// import FocusTrackingManager from '../managers/FocusTrackingManager';

// const useFocusTracking = () => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [isTracking, setIsTracking] = useState(false);
//   const [sessionData, setSessionData] = useState({
//     focusScore: 100,
//     sessionStats: {
//       duration: '00:00',
//       distractions: 0,
//       peakFocus: 100,
//     },
//     alerts: []
//   });

//   const sessionId = useRef(Date.now().toString());
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const streamRef = useRef(null);
//   const detectionRef = useRef(null);

//   useEffect(() => {
//     const initializeTracking = async () => {
//       try {
//         await FocusTrackingService.loadModels();
//         setIsLoading(false);
//       } catch (err) {
//         console.error('Failed to initialize tracking:', err);
//       }
//     };

//     initializeTracking();
//     return () => cleanup();
//   }, []);

//   const cleanup = () => {
//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach(track => track.stop());
//     }
//     if (detectionRef.current) {
//       clearInterval(detectionRef.current);
//     }
//   };

//   const startFaceDetection = async () => {
//     if (!videoRef.current) return;

//     FocusTrackingManager.createSession(sessionId.current);

//     detectionRef.current = setInterval(async () => {
//       try {
//         const detections = await FocusTrackingService.detectFace(videoRef.current);
//         const { score, isLookingAway } = FocusTrackingService.calculateFocusScore(
//           detections,
//           videoRef.current.offsetWidth,
//           videoRef.current.offsetHeight
//         );

//         if (isLookingAway) {
//           FocusTrackingManager.addAlert(sessionId.current, 'Looking away from screen');
//         }

//         if (!detections || detections.length === 0) {
//           FocusTrackingManager.addAlert(sessionId.current, 'No face detected');
//         }

//         FocusTrackingManager.updateFocusScore(sessionId.current, score, isLookingAway);
//         const stats = FocusTrackingManager.getSessionStats(sessionId.current);
        
//         setSessionData({
//           focusScore: stats.currentFocus,
//           sessionStats: {
//             duration: stats.duration,
//             distractions: stats.distractions,
//             peakFocus: stats.peakFocus,
//           },
//           alerts: stats.alerts
//         });
//       } catch (err) {
//         console.error('Detection error:', err);
//       }
//     }, 1000);
//   };

//   const toggleTracking = async () => {
//     if (!isTracking) {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: {
//             width: 640,
//             height: 480,
//             facingMode: 'user'
//           }
//         });
        
//         streamRef.current = stream;
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//         }
        
//         setIsTracking(true);
//         startFaceDetection();
//       } catch (err) {
//         FocusTrackingManager.addAlert(sessionId.current, 'Camera access denied');
//         console.error('Camera error:', err);
//       }
//     } else {
//       cleanup();
//       FocusTrackingManager.endSession(sessionId.current);
//       setIsTracking(false);
//     }
//   };

//   return {
//     isLoading,
//     isTracking,
//     sessionData,
//     videoRef,
//     canvasRef,
//     toggleTracking
//   };
// };

// export default useFocusTracking;


import { useState, useRef, useCallback } from 'react';

const useCamera = () => {
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreamActive(true);
        setError(null);
        
        // Wait for video to be ready
        await new Promise((resolve) => {
          videoRef.current.onloadedmetadata = resolve;
        });
        
        return true;
      }
      return false;
    } catch (err) {
      setError('Camera access denied. Please check permissions.');
      setIsStreamActive(false);
      return false;
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsStreamActive(false);
    }
  }, []);

  return {
    videoRef,
    isStreamActive,
    error,
    startCamera,
    stopCamera
  };
};

export default useCamera;