// Chatbot.js
import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './CSS/chatBot.css'; // Import styling for the chatbot

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API); // Use an environment variable for security
const model = genAI.getGenerativeModel({ model: 'tunedModels/sit-bookstore-prompts-20-hzmhblzoztil' });

const Chatbot = () => {
  const [messages, setMessages] = useState([]); // Stores the chat messages
  const [input, setInput] = useState(''); // Tracks the user input

  // Function to handle sending messages and fetching the response
  const handleSendMessage = async () => {
    if (!input) return;

    // Append user's message to the chat
    setMessages((prevMessages) => [...prevMessages, { sender: 'user', text: input }]);

    try {
      // Send message to Google Generative AI model
      console.log(input + ". Answer is less then 50 words.")
      const result = await model.generateContent(input + ". Answer is less then 50 words.");
      const botReply = result.response.text(); // Get bot's response
      console.log("CHATBOT REPLY: " + botReply)

      // Append the bot's response to the chat
      setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: botReply }]);
    } catch (error) {
      console.error('Error fetching bot response:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: "I'm having trouble responding right now." },
      ]);
    }

    setInput(''); // Clear input field after sending
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