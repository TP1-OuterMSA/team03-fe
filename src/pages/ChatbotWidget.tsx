import { useState } from 'react';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import { Bot, X } from 'lucide-react';
import config from '../components/chatbot/config';
import MessageParser from '../components/chatbot/MessageParser';
import ActionProvider from '../components/chatbot/ActionProvider';
import styled from 'styled-components';

const ChatbotContainer = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
`;

const ChatbotOpenWrapper = styled.div`
  width: 640px; /* 챗봇 전체 너비 */
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  background-color: #fff;
  padding: 0;
  margin: 0;
`;

const ChatbotHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1976d2;
  padding: 10px 12px;
  color: white;
  font-weight: bold;
`;

const ChatbotTitle = styled.span`
  font-size: 16px;
  display: flex;
  align-items: center;
`;

const ChatbotCloseButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  color: white;
`;

const ChatbotContentWrapper = styled.div`
  padding: 0;
  margin: 0;
  width: 100%;
  box-sizing: border-box;

  .react-chatbot-kit-chat-container {
    padding-left: 0 !important;
    padding-right: 0 !important;
    margin: 0 !important;
    width: 100% !important;
    box-sizing: border-box !important;
  }

  .react-chatbot-kit-chat-inner-container {
    margin: 0 !important;
    padding: 0 !important;
  }

  .react-chatbot-kit-chat-message-container {
    /* 메시지 컨테이너 자체의 패딩을 줄이거나 없애서 메시지가 더 많은 공간을 차지하도록 합니다. */
    margin: 0 !important;
    padding: 8px !important; /* 기본 패딩 유지 또는 조절 */
    overflow-x: hidden;
    overflow-y: auto;
    flex-direction: column;
    align-items: flex-start;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 3px;
    }

    &::-webkit-scrollbar-track {
      background-color: rgba(0, 0, 0, 0.05);
    }
  }

  .react-chatbot-kit-chat-input-container {
    margin: 0 !important;
    padding: 0 8px 8px 8px !important;
  }

  .react-chatbot-kit-chat-header {
    display: none !important;
  }

  .react-chatbot-kit-chat-wrapper {
    padding: 0 !important;
    margin: 0 !important;
    width: 100% !important;
  }

  .react-chatbot-kit-chat-inner {
    padding-right: 0 !important;
    margin-right: 0 !important;
  }

  /* 챗봇 봇 메시지 너비 조정 */
  .react-chatbot-kit-chat-bot-message {
    width: calc(100% - 200px) !important; /* 메시지 컨테이너의 패딩을 고려하여 최대 너비 설정 */
    margin-left: 0 !important;
    word-break: break-word; /* 긴 단어가 잘리지 않고 다음 줄로 넘어가도록 함 */
    white-space: pre-wrap; /* 공백과 줄바꿈을 유지하면서 자동 줄바꿈 */
  }

  /* 챗봇 사용자 메시지 너비 조정 */
  .react-chatbot-kit-user-chat-message {
    max-width: calc(100% - 20px) !important; /* 메시지 컨테이너의 패딩을 고려하여 최대 너비 설정 */
    margin-right: 0 !important;
    word-break: break-word; /* 긴 단어가 잘리지 않고 다음 줄로 넘어가도록 함 */
    white-space: pre-wrap; /* 공백과 줄바꿈을 유지하면서 자동 줄바꿈 */
  }

  .react-chatbot-kit-chat-input::placeholder { /* 플레이스홀더 스타일 */
    color: #333; /* 플레이스홀더 텍스트 색상 */
    opacity: 1; /* 플레이스홀더 투명도 (기본값) */
  }

  .react-chatbot-kit-chat-scroll-container {
    margin-right: 0 !important;
    padding-right: 0 !important;
  }
`;

const ChatbotCloseIcon = styled(X)`
  size: 20;
`;

const ChatbotToggleButton = styled.button`
  background-color: #3f51b5;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ChatbotIcon = styled(Bot)`
  color: white;
  size: 28;
`;

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ChatbotContainer>
      {isOpen && (
        <ChatbotOpenWrapper>
          <ChatbotHeader>
            <ChatbotTitle>🤖 급식봇</ChatbotTitle>
            <ChatbotCloseButton onClick={() => setIsOpen(false)}>
              <ChatbotCloseIcon />
            </ChatbotCloseButton>
          </ChatbotHeader>
          <ChatbotContentWrapper>
            <div className="react-chatbot-kit-chat-container">
              <Chatbot
                config={config}
                messageParser={MessageParser}
                actionProvider={ActionProvider}
              />
            </div>
          </ChatbotContentWrapper>
        </ChatbotOpenWrapper>
      )}
      {!isOpen && (
        <ChatbotToggleButton onClick={() => setIsOpen(true)}>
          <ChatbotIcon />
        </ChatbotToggleButton>
      )}
    </ChatbotContainer>
  );
};

export default ChatbotWidget;