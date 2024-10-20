"use client";

import React, { useState } from 'react';

const MessageBox: React.FC<{ onSend: (message: string) => void }> = ({ onSend }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <div className="bg-gray-500 rounded-lg shadow-md p-4 flex flex-col mb-2">
      <h2 className="font-bold text-lg text-white mb-2">Send a Message:</h2>
      <div className="flex items-center border border-gray-300 rounded-md bg-gray-600">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
          className="p-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full bg-gray-600 text-white"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-r-md hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default MessageBox;
