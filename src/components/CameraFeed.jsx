import React, { useRef } from 'react';
import { Camera, PauseCircle } from 'lucide-react';

const CameraFeed = ({ isTracking, isLoading, onToggleTracking, videoRef, canvasRef }) => {
  return (
    <div className="lg:col-span-2 bg-white rounded-lg shadow-lg">
      <div className="relative aspect-video">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full rounded-t-lg"
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
        />
        {isTracking && (
          <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/50 text-white px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            Recording
          </div>
        )}
      </div>
      
      <div className="p-6">
        <button
          onClick={onToggleTracking}
          disabled={isLoading}
          className={`w-full py-3 rounded-md text-white flex items-center justify-center ${
            isLoading ? 'bg-gray-400' :
            isTracking ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? (
            'Loading models...'
          ) : isTracking ? (
            <><PauseCircle className="w-5 h-5 mr-2" /> Stop Tracking</>
          ) : (
            <><Camera className="w-5 h-5 mr-2" /> Start Tracking</>
          )}
        </button>
      </div>
    </div>
  );
};

export default CameraFeed;