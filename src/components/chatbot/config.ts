import { createChatBotMessage } from 'react-chatbot-kit';
import FoodOptions, { FoodOptionsProps } from './FoodOptions';
import ReferenceDocuments, { ReferenceDocumentsProps } from './ReferenceDocuments';
import EndOptions, { EndOptionsProps } from './EndOptions';
import { FC } from 'react';

const config = {
    botName: '급식봇',
    initialMessages: [
        createChatBotMessage('안녕하세요! 아래 카테고리 중 하나를 선택해주세요.', {
            delay: 500,
            widget: 'foodOptions',
        }),
    ],
    customStyles: {
        botMessageBox: {
            backgroundColor: '#e3f2fd',
            padding: 10,
            borderRadius: 8,
            marginBottom: 8,
            color: '#3333', // 대비 더 좋은 텍스트 색상
            fontSize: '14px',
            lineHeight: '1.4',
        },
        chatButton: {
            backgroundColor: '#3f51b5',
            color: '#fff',
        },
        userMessageBox: {
            backgroundColor: '#f1f8e9',
            padding: 10,
            borderRadius: 8,
            marginBottom: 8,
            textAlign: 'right',
            color: '#333',
            fontSize: '14px',
            lineHeight: '1.4',
        },
    },
    widgets: [
        {
            widgetName: 'foodOptions',
            widgetFunc: FoodOptions as FC<FoodOptionsProps>,
        },
        {
            widgetName: 'referenceDocumentsButton',
            widgetFunc: ReferenceDocuments as FC<ReferenceDocumentsProps>,
        },
        {
            widgetName: 'endOptions',
            widgetFunc: EndOptions as FC<EndOptionsProps>,
        },
    ],
} as any; // 명시적인 any 타입 캐스팅

export default config;