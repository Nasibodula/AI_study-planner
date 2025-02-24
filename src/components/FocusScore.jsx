import React from "react";

const FocusScore = ({ score }) => {
  return (
    <div className="p-4 bg-blue-100 rounded-lg">
      <h2 className="text-xl font-bold">Focus Score</h2>
      <p className="text-2xl">{score}%</p>
    </div>
  );
};

export default FocusScore;