import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hi! I am your AI Hotel Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch(`http://localhost:8000/api/ai/chat?message=${encodeURIComponent(userMsg.text)}`, {
        method: 'POST' // using query param for simple demo
      });
      const data = await res.json();
      
      // Simulate slight processing delay for realism
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'ai', text: data.response, intent: data.intent }]);
        setIsTyping(false);
      }, 800);
      
    } catch (err) {
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'ai', text: 'Sorry, I am having trouble connecting to my neural network right now.' }]);
        setIsTyping(false);
      }, 500);
    }
  };

  return (
    <div className={`chatbot-wrapper ${isOpen ? 'open' : ''}`}>
      {!isOpen && (
        <button className="chat-toggle-btn" onClick={toggleChat}>
          <MessageSquare size={24} />
          <span className="notification-dot"></span>
        </button>
      )}

      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-agent-info">
              <div className="agent-avatar"><Bot size={20} /></div>
              <div>
                <h3>AI Assistant</h3>
                <span className="online-status">Online</span>
              </div>
            </div>
            <button className="close-btn" onClick={toggleChat}><X size={20} /></button>
          </div>
          
          <div className="chat-body">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-bubble-wrapper ${msg.sender}`}>
                <div className="chat-bubble">
                  {msg.text}
                </div>
                {msg.intent === 'booking' && (
                  <div className="chat-action-btn">
                     <a href="/rooms" className="internal-btn">View Rooms</a>
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="chat-bubble-wrapper ai">
                <div className="chat-bubble typing">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <form className="chat-footer" onSubmit={handleSend}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..." 
            />
            <button type="submit" className="send-btn" disabled={!input.trim()}>
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
