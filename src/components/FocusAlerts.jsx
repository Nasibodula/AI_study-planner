import React from 'react';
import { AlertCircle } from 'lucide-react';

const FocusAlerts = ({ alerts }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="font-semibold mb-4">Recent Alerts</h3>
      <div className="space-y-3">
        {alerts.map(alert => (
          <div 
            key={alert.id} 
            className="flex items-center gap-2 p-4 border rounded-lg bg-red-50 border-red-200 text-red-900"
          >
            <AlertCircle className="h-4 w-4" />
            <p className="text-sm">
              {alert.message} - {alert.timestamp}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FocusAlerts;