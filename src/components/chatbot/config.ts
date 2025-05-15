import { createChatBotMessage } from 'react-chatbot-kit';
import FoodOptions from './FoodOptions';
import ReferenceDocuments from './ReferenceDocuments';
import EndOptions from './EndOptions';

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
            backgroundColor: '#3f51b5',
        },
        chatButton: {
            backgroundColor: '#3f51b5',
        },
    },
    widgets: [
        {
            widgetName: 'foodOptions',
            widgetFunc: FoodOptions,
        },
        {
            widgetName: 'referenceDocumentsButton',
            widgetFunc: ReferenceDocuments,
        },
        {
            widgetName: 'endOptions',
            widgetFunc: EndOptions,
        },
    ],
};

export default config;