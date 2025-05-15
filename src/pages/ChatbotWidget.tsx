import React, { useState } from 'react';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import { Bot, X } from 'lucide-react'; // 아이콘용
import config from '../components/chatbot/config';
import MessageParser from '../components/chatbot/MessageParser';
import ActionProvider from '../components/chatbot/ActionProvider';

const ChatbotWidget = () => {
    const [isOpen, setIsOpen] = useState(false);

    const chatbotContainerStyle = {
        width: 320,
        borderRadius: 8,
        overflow: 'hidden',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
        backgroundColor: '#f8f8f8',
    };

    const closeButtonStyle = {
        background: 'none',
        border: 'none',
        padding: 8,
        cursor: 'pointer',
        alignSelf: 'flex-end',
        marginRight: 8,
        marginTop: 8,
    };

    return (
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999 }}>
            {isOpen && (
                <div style={chatbotContainerStyle}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button onClick={() => setIsOpen(false)} style={closeButtonStyle}>
                            <X size={20} color="#555" />
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