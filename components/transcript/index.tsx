"use client"; // Ensure this is a client component

import React from 'react';

const TranscriptBox: React.FC<{ transcript: string }> = ({ transcript }) => {
  return (
    <div className="flex flex-col items-center mt-4">
      <h2 className="font-bold mb-2">Transcript:</h2>
      <div className="p-4 border border-gray-300 rounded-md w-full max-w-lg h-48 overflow-y-auto bg-gray-100">
        <p>{transcript}</p>
      </div>
    </div>
  );
};

export default TranscriptBox;
