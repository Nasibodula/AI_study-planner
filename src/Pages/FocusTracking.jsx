import React, { useState } from 'react';
import { Camera, AlertCircle, PauseCircle, Eye, Timer, BarChart2 } from 'lucide-react';

const FocusTrackingPage = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [focusScore, setFocusScore] = useState(85);
  
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
                    {/* Placeholder for camera feed */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img 
                        src="/api/placeholder/640/360" 
                        alt="Camera Feed Placeholder"
                        className="rounded-lg"
                      />
                    </div>
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
                    <span className="font-semibold">45:23</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Distractions</span>
                    <span className="font-semibold">3</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Peak Focus</span>
                    <span className="font-semibold">92%</span>
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
                  <div className="p-4 border-l-4 border-red-500 bg-red-50 rounded-r-lg">
                    Looking away from screen - 2 mins ago
                  </div>
                  <div className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
                    Focus restored - 1 min ago
                  </div>
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