import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
  isHelpful?: boolean | null;
}

const Chatbot = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize session ID once per session
  const [sessionId] = useState(() => {
    const saved = sessionStorage.getItem('chatbot_session');
    if (saved) return saved;
    const newId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('chatbot_session', newId);
    return newId;
  });
  
  const SUGGESTED_TOPICS = [
    t('chatbot.q1', 'How do I register as a Startup?'),
    t('chatbot.q2', 'What is the evaluation process?'),
    t('chatbot.q3', 'How are pilots funded?'),
    t('chatbot.q4', 'What is a DPIIT recognition number?')
  ];

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: t('chatbot.welcome'),
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  
  // Re-translate the welcome message when language changes
  useEffect(() => {
    setMessages(prev => {
      const newMessages = [...prev];
      if (newMessages.length > 0 && newMessages[0].id === '1') {
        newMessages[0].text = t('chatbot.welcome');
      }
      return newMessages;
    });
  }, [t]);

  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5015/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message: text })
      });
      
      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      
      const botResponse: Message = {
        id: data.id || (Date.now() + 1).toString(),
        text: data.text,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "I am having trouble connecting to my knowledge base right now. Please try again later.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-0 right-8 h-12 w-48 bg-blue-800 text-white rounded-t-sm border border-blue-900 border-b-0 shadow-none flex items-center justify-between px-4 hover:bg-blue-900 focus:outline-none transition-transform transform ${isOpen ? 'translate-y-12' : 'translate-y-0'}`}
        aria-label="Open Help"
      >
        <span className="text-nav">{t('chatbot.help')}</span>
        <MessageSquare className="h-4 w-4" />
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-0 right-8 w-80 sm:w-96 bg-white border border-gray-400 border-b-0 shadow-2xl flex flex-col transition-transform duration-200 transform origin-bottom ${isOpen ? 'scale-100 z-50' : 'scale-0 -z-10'}`}
        style={{ height: '450px' }}
      >
        {/* Chat Header */}
        <div className="bg-blue-800 text-white p-3 flex justify-between items-center border-b border-blue-900">
          <div className="flex items-center space-x-2">
            <Bot className="h-4 w-4" />
            <span className="text-nav">{t('chatbot.assistant')}</span>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-gray-300 hover:text-white focus:outline-none p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col space-y-4">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] px-3 py-2 text-small ${
                  msg.sender === 'user' 
                    ? 'bg-blue-100 text-blue-900 border border-blue-200' 
                    : 'bg-white text-gray-800 border border-gray-300 shadow-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          
          {/* Predefined Questions Chips */}
          {messages.length === 1 && (
            <div className="flex flex-col space-y-2 mt-4 pt-4 border-t border-gray-200">
              <span className="text-caption">{t('chatbot.suggested', 'Suggested Topics')}</span>
              <div className="flex flex-col space-y-2">
                {SUGGESTED_TOPICS.map((topic, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(topic)}
                    disabled={isLoading}
                    className="text-left text-small bg-white border border-gray-300 text-blue-800 px-3 py-2 hover:bg-gray-50 transition-none disabled:opacity-50"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[85%] px-4 py-3 bg-white text-gray-800 border border-gray-300 shadow-sm flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin text-blue-800" />
                <span className="text-small text-gray-500">Retrieving knowledge...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-3 bg-gray-100 border-t border-gray-300">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputValue);
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t('chatbot.placeholder')}
              className="flex-1 bg-white border border-gray-400 focus:outline-none focus:border-blue-800 px-3 py-2 text-small rounded-none"
            />
            <button 
              type="submit"
              disabled={!inputValue.trim()}
              className="bg-blue-800 text-white p-2 hover:bg-blue-900 disabled:bg-gray-400 transition-none rounded-none"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
