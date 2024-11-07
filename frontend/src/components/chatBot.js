// Chatbot.js
import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './CSS/chatBot.css';

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API);
const model = genAI.getGenerativeModel({ model: 'tunedModels/sit-bookstore-prompts-30-fs7zeoml2rda' });

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSendMessage = async () => {
    if (!input) return;
    setMessages((prevMessages) => [...prevMessages, { sender: 'user', text: input }]);

    try {
      const result = await model.generateContent(input);
      const botReply = result.response.text();
      setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: botReply }]);
    } catch (error) {
      console.error('Error fetching bot response:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: "I'm having trouble responding right now." },
      ]);
    }

    setInput('');
  
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">Chat with Us</div>
      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chatbot-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;