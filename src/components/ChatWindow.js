"use client";
import { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";
// Removed VoiceButton import
// import VoiceButton from "./VoiceButton"; // No longer needed

export default function ChatWindow() {
  const [messages, setMessages] = useState([
    { type: "bot", text: "Hi! I’m your assistant from Dezy Clinic. How can I help you today?" }
  ]);
  const [responseId, setResponseId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState(""); // State for input field
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (msg) => {
    if (!msg.trim()) return;

    const newMessages = [...messages, { type: "user", text: msg }];
    setMessages(newMessages);
    setLoading(true);
    setInputValue(""); // Clear input after sending

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msg,
          responseId: responseId,
        }),
      });

      const data = await res.json();

      setMessages(prev => [
        ...prev,
        { type: "bot", text: data.content || "Something went wrong." }
      ]);

      setResponseId(data.responseId);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { type: "bot", text: "⚠️ Error: Could not contact server." }
      ]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage(inputValue);
    }
  };

  return (
    // Main container for the chat window - centered and styled
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl h-[650px] bg-white shadow-2xl rounded-2xl flex flex-col overflow-hidden border border-gray-200">

        {/* Chat Header */}
        <div className="flex items-center justify-center py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md">
          <h1 className="text-xl font-semibold">Dezy Clinic Assistant</h1>
        </div>

        {/* Messages Display Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg, idx) => (
            <MessageBubble key={idx} text={msg.text} sender={msg.type} />
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl rounded-bl-none max-w-[80%] animate-pulse">
                Typing...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Message Input and Send Button */}
        <div className="flex items-center gap-3 p-4 bg-white border-t border-gray-200 shadow-inner">
          <input
            type="text"
            placeholder="Type your message here..."
            value={inputValue} // Bind input value to state
            onChange={(e) => setInputValue(e.target.value)} // Update state on change
            onKeyDown={handleKeyPress} // Handle Enter key press
            className="flex-1 px-5 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 text-base transition duration-200"
            disabled={loading} // Disable input while loading
          />
          <button
            onClick={() => sendMessage(inputValue)} // Send message on click
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full transition duration-200 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading || !inputValue.trim()} // Disable if loading or input is empty
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}