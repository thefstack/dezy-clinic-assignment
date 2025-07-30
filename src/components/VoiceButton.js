import { useState } from 'react';

export default function VoiceButton({ onResult }) {
  const [listening, setListening] = useState(false);

  const handleVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Voice recognition not supported.");

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    recognition.start();
  };

  return (
    <button
      onClick={handleVoice}
      className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors 
        ${listening ? 'bg-red-500 animate-pulse' : 'bg-green-500 hover:bg-green-600'}`}
      title="Click to speak"
    >
      🎤
    </button>
  );
}
