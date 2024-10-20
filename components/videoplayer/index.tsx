"use client";

import React, { useState } from 'react';
import { FaMicrophone } from 'react-icons/fa';

const VideoPlayer: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    
    // Simulate a loading delay (e.g., fetching video or starting a process)
    setTimeout(() => {
      setLoading(false);
      // Add your logic to handle the microphone action here
    }, 2000); // Adjust the delay as needed
  };

  return (
    <div className="flex justify-center items-center mb-0 h-screen">
      <button
        onClick={handleClick}
        className={`flex justify-center items-center border-4 border-white bg-transparent rounded-full p-10  shadow-lg transition-transform transform 
          ${loading ? 'animate-bounce' : 'hover:scale-105'}`}
      >
        {loading ? (
          <div className="animate-pulse">
            <FaMicrophone className="text-white" size={100} />
          </div>
        ) : (
          <FaMicrophone className="text-white" size={100} />
        )}
      </button>
    </div>
  );
};

export default VideoPlayer;
