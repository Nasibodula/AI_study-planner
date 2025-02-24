import React from "react";

const SessionReport = ({ sessions }) => {
  return (
    <div className="p-4 bg-green-100 rounded-lg">
      <h2 className="text-xl font-bold">Session Report</h2>
      <ul>
        {sessions.map((session, index) => (
          <li key={index} className="mt-2">
            <p>Session {index + 1}: {session.focusScore}% Focus</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SessionReport;