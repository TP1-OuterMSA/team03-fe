import React, { useState } from 'react';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import { Bot, X } from 'lucide-react'; // 아이콘용
import config from '../components/chatbot/config';
import MessageParser from '../components/chatbot/MessageParser';
import ActionProvider from '../components/chatbot/ActionProvider';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999 }}>
      {isOpen && (
        <div style={{ width: 320 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={() => setIsOpen(false)} style={{ marginBottom: 4 }}>
              <X size={20} />
            </button>
          </div>
          <Chatbot
            config={config}
            messageParser={MessageParser}
            actionProvider={ActionProvider}
          />
        </div>
      )}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            backgroundColor: '#3f51b5',
            borderRadius: '50%',
            width: 60,
            height: 60,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Bot color="white" size={28} />
        </button>
      )}
    </div>
  );
};

export default ChatbotWidget;