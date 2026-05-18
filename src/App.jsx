import React, { useState } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'You are Samsung Brilliant AI, an intelligent, sleek assistant.' },
    { role: 'assistant', content: 'Welcome to Samsung Brilliant AI. How can I assist your smart network today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Google Family Invitation States
  const [familyEmail, setFamilyEmail] = useState('');
  const [familyStatus, setFamilyStatus] = useState('');

  // PASTE YOUR LIVE RENDER BACKEND URL HERE
  const BACKEND_URL = 'https://ai-app-backend-9258.onrender.com'; 

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) throw new Error('Server connectivity issue');

      const data = await response.json();
      setMessages([...updatedMessages, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      setMessages([...updatedMessages, { role: 'assistant', content: 'Failed to communicate with Brilliant AI Engine.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFamilyInvite = async (e) => {
    e.preventDefault();
    if (!familyEmail.trim()) return;

    setFamilyStatus('Syncing Invitation...');

    try {
      const response = await fetch(`${BACKEND_URL}/api/invite-family`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: familyEmail }),
      });

      const data = await response.json();
      if (data.success) {
        setFamilyStatus('Opening Official Google Workspace Hub...');
        window.open(data.googleLink, '_blank', 'noopener,noreferrer');
        setFamilyEmail('');
      } else {
        setFamilyStatus('Gateway error.');
      }
    } catch (error) {
      setFamilyStatus('Failed to sync invitation.');
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo-group">
          <div className="ai-orb"></div>
          <h2>Samsung Brilliant AI</h2>
        </div>
      </header>

      {/* Google Family Invitation Portal Component */}
      <section className="family-invite-section">
        <h3>Google Family Ecosystem Hub</h3>
        <p>Register a family email address below to log configuration records and open Google Family management settings:</p>
        <form onSubmit={handleFamilyInvite} className="family-form">
          <input 
            type="email" 
            value={familyEmail} 
            onChange={(e) => setFamilyEmail(e.target.value)} 
            placeholder="family-member@gmail.com" 
            required 
          />
          <button type="submit">Sync Invite</button>
        </form>
        {familyStatus && <span className="status-msg">{familyStatus}</span>}
      </section>

      <div className="chat-area">
        {messages.filter(m => m.role !== 'system').map((msg, index) => (
          <div key={index} className={`message-wrapper ${msg.role}`}>
            <div className="bubble">{msg.content}</div>
          </div>
        ))}
        {isLoading && <div className="bubble typing">Processing Neural Network...</div>}
      </div>

      <form className="input-form" onSubmit={handleSend}>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Interact with Brilliant AI..." />
        <button type="submit" disabled={isLoading}>Process</button>
      </form>
    </div>
  );
}

export default App;
