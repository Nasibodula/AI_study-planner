import React, { useRef, useState } from "react";

const FocusTracker = () => {
  const videoRef = useRef(null);
  const [isFocused, setIsFocused] = useState(true);

  const startCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => console.error("Error accessing camera:", err));
  };

  const checkFocus = () => {
    // Simulate focus detection (replace with actual AI logic)
    setIsFocused(Math.random() > 0.5);
  };

  React.useEffect(() => {
    startCamera();
    const interval = setInterval(checkFocus, 5000); // Check focus every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <video ref={videoRef} autoPlay className="w-full h-auto rounded-lg"></video>
      <p className="mt-2 text-lg font-semibold">
        Status: {isFocused ? "Focused" : "Distracted"}
      </p>
    </div>
  );
};

export default FocusTracker;