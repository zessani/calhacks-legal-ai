'use client';

import { useState } from 'react';

export default function TestPage() {
  console.log("Test page rendering");
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Test Page</h1>
      <p>Count: {count}</p>
      <button onClick={() => {
        console.log("Button clicked");
        setCount(count + 1);
      }}>
        Increment
      </button>
    </div>
  );
}
