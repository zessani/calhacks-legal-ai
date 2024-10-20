'use client';

import React, { useState, useEffect } from 'react';

export default function TestPage() {
  console.log("Test page rendering");
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("Component mounted");
  }, []);

  const handleClick = () => {
    console.log("Button clicked");
    setCount(prevCount => {
      console.log("Updating count");
      return prevCount + 1;
    });
  };

  console.log("Rendering with count:", count);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>
      <p className="mb-4">Count: {count}</p>
      <button 
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleClick}
      >
        Increment
      </button>
    </div>
  );
}
