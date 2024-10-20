"use client";

import React, { useState } from 'react';

const languages = [
  'English', 'Spanish', 'French', 'German', 'Chinese',
  'Japanese', 'Russian', 'Italian', 'Portuguese', 'Arabic',
  'Hindi', 'Bengali', 'Turkish', 'Vietnamese', 'Korean'
];

const LeftNavbar: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Uploaded file:", file.name);
    }
  };

  return (
    <div className="bg-[#001229] text-white p-4 h-screen w-64">
      <h2 className="text-xl font-bold mb-8">Upload File</h2>
      <div className="mb-16">
        <input 
          type="file" 
          onChange={handleFileUpload} 
          className="text-white mb-2" 
        />
      </div>
      <div>
        <label htmlFor="language-selector" className="block mb-4">
          Select Language:
        </label>
        <select
          id="language-selector"
          value={selectedLanguage}
          onChange={handleLanguageChange}
          className="bg-gray-700 text-white rounded-md w-full"
        >
          {languages.map((language) => (
            <option key={language} value={language}>
              {language}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LeftNavbar;
