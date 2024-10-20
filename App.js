import React, { useState } from 'react';
import { useTTS } from '@cartesia/cartesia-js/react';
import './App.css';

function TextToSpeech() {
    const tts = useTTS({
        apiKey: "00bd3032-50f3-4080-8f3a-ee13c3735a0a",
        sampleRate: 44100,
    });

    const [text, setText] = useState("");
    const [language, setLanguage] = useState("en");

    // Map languages to voice IDs
    const languageVoiceMap = {
        en: "41534e16-2966-4c6b-9670-111411def906", // English
        es: "15d0c2e2-8d29-44c3-be23-d585d5f154a1", // Spanish
        fr: "a8a1eb38-5f15-4c1d-8722-7ac0f329727d", // French
        zh: "e90c6678-f0d3-4767-9883-5d0ecf5894a8", // Chinese
        hi: "ac7ee4fa-25db-420d-bfff-f590d740aeb2", // Hindi
        ru: "779673f3-895f-4935-b6b5-b031dc78b319"  // Russian
    };

    const handlePlay = async () => {
        const voiceId = languageVoiceMap[language];
        try {
            // Begin buffering the audio.
            await tts.buffer({
                model_id: "sonic-multilingual",
                voice: {
                    mode: "id",
                    id: voiceId,
                },
                transcript: text,
                language,
            });

            // Immediately play the audio.
            await tts.play();
        } catch (error) {
            console.error('Error playing TTS:', error);
        }
    };

    return (
        <div className="container">
            <h1>Cartesia TTS Playground</h1>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type your text here..."
                rows="4"
            />
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="zh">Chinese</option>
                <option value="hi">Hindi</option>
                <option value="ru">Russian</option>
            </select>
            <button onClick={handlePlay}>Play</button>
        </div>
    );
}

export default TextToSpeech;
