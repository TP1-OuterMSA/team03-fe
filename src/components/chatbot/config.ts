import { createChatBotMessage } from 'react-chatbot-kit';
import React from 'react';
import FoodOptions from './FoodOptions'; // FoodOptions 컴포넌트 import

const config = {
    botName: '급식봇',
    initialMessages: [
        createChatBotMessage('안녕하세요! 아래 카테고리 중 하나를 선택해주세요:', {
            delay: 500,
            widget: 'foodOptions', // 초기 메시지에 FoodOptions 위젯 연결
        }),
    ],
    customStyles: {
        botMessageBox: {
            backgroundColor: '#3f51b5',
        },
        chatButton: {
            backgroundColor: '#3f51b5',
        },
    },
    widgets: [
        {
            widgetName: 'foodOptions',
            widgetFunc: FoodOptions, // ✅ FoodOptions 컴포넌트 자체를 전달
        },
    ],
};

export default config;