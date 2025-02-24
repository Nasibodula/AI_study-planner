import React from "react";

const DistractionAlert = ({ isFocused }) => {
  if (isFocused) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg">
      <p>You seem distracted! Get back to studying.</p>
    </div>
  );
};

export default DistractionAlert;