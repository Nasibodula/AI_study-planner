import React from 'react'

export default function FocusHeatmap() {
  return (
    <div className="bg-white rounded-lg shadow mt-8">
        <div className="p-6">
        <h2 className="text-lg font-semibold">Weekly Focus Heatmap</h2>
        <div className="grid grid-cols-7 gap-2 mt-4">
            {Array.from({ length: 24 }).map((_, hourIndex) => (
            <React.Fragment key={hourIndex}>
                {Array.from({ length: 7 }).map((_, dayIndex) => {
                const intensity = Math.random();
                return (
                    <div
                    key={`${hourIndex}-${dayIndex}`}
                    className="aspect-square rounded"
                    style={{
                        backgroundColor: `rgba(37, 99, 235, ${intensity})`,
                    }}
                    title={`Hour ${hourIndex}, Day ${dayIndex + 1}`}
                    />
                );
                })}
            </React.Fragment>
            ))}
        </div>
        <div className="mt-4 flex justify-between text-sm text-gray-500">
            <span>Less Focused</span>
            <div className="flex gap-2">
            <div className="w-4 h-4 bg-blue-100"></div>
            <div className="w-4 h-4 bg-blue-300"></div>
            <div className="w-4 h-4 bg-blue-500"></div>
            <div className="w-4 h-4 bg-blue-700"></div>
            </div>
            <span>More Focused</span>
        </div>
        </div>
    </div>
  )
}
