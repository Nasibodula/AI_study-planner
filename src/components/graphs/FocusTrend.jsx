import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,ResponsiveContainer } from 'recharts';
import {TrendingUp } from 'lucide-react';
import axios from 'axios';


const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export default function FocusTrendgraph() {

    // Sample data for charts
    const focusData = [
      { day: 'Mon', score: 85 },
      { day: 'Tue', score: 75 },
      { day: 'Wed', score: 90 },
      { day: 'Thu', score: 82 },
      { day: 'Fri', score: 88 },
      { day: 'Sat', score: 70 },
      { day: 'Sun', score: 85 }
    ];
  return (
    <div className="p-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Focus Score Trend
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={focusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#2563eb" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
    </div>

  )
}
