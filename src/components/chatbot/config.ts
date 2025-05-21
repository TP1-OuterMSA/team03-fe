import { createChatBotMessage } from 'react-chatbot-kit';
import FoodOptions, { FoodOptionsProps } from './FoodOptions';
import ReferenceDocuments, { ReferenceDocumentsProps } from './ReferenceDocuments';
import EndOptions, { EndOptionsProps } from './EndOptions';
import { FC } from 'react';
import CustomBotAvatar from './CustomBotAvatar';

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
      backgroundColor: '#1976d2',
      padding: 10,
      borderRadius: 8,
      marginBottom: 8,
      color: '#020715',
      fontSize: '14px',
      lineHeight: '1.4',
    },
    chatButton: {
      backgroundColor: '#1976d2',
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
      widgetFunc: EndOptions as FC<EndOptionsProps>, // EndOptions 컴포넌트 사용
    },
  ],
  inputBox: {
    placeholder: '답변을 입력해주세요',
  },
  customComponents: {
    botAvatar: CustomBotAvatar,
  },
} as any;

export default config;