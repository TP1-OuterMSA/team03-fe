import { createChatBotMessage } from 'react-chatbot-kit';
import axios from 'axios';

class ActionProvider {
    createChatBotMessage: any;
    setState: any;

    constructor(createChatBotMessage: any, setStateFunc: any) {
        this.createChatBotMessage = createChatBotMessage;
        this.setState = setStateFunc;
    }

    handleMealInfo = (message: string) => {
        this.handleGeneralMessage(message, 'FOOD_INFO');
    };

    handleFeedback = (message: string) => {
        this.handleGeneralMessage(message, 'FOOD_FEEDBACK_INFO');
    };

    handleDefault = (message: string) => {
        const defaultMessage = this.createChatBotMessage('죄송해요. 아직 그 요청은 이해하지 못했어요.');
        this.setState((prev: any) => ({
            ...prev,
            messages: [...prev.messages, defaultMessage],
        }));
    };

    handleCategorySelect = (category: string) => {
        // 카테고리 선택 처리
        this.setState((prev: any) => ({
            ...prev,
            category: category, // 선택된 카테고리를 상태에 저장
            messages: [
                ...prev.messages,
                this.createChatBotMessage(
                    `선택하신 카테고리는 ${
                        category === 'FOOD_INFO' ? '급식 정보' : '급식 피드백'
                    }입니다. 질문해주세요.`,
                    {
                        withAvatar: false,
                        delay: 500,
                        widget: undefined,
                    }
                ),
            ],
        }));
    };

    handleGeneralMessage = (question: string, category: string) => {
        // const { category } = this.state;  // Removed: category is now passed as an argument
        if (!category) {
            const errorMessage = this.createChatBotMessage(
                '먼저 급식 정보 또는 급식 피드백 중에서 선택해주세요.'
            );
            this.setState((prev: any) => ({
                ...prev,
                messages: [...prev.messages, errorMessage],
            }));
            return;
        }

        this.handleApiResponse(category, question);
    };

    handleApiResponse = (category: string, question: string) => {
        const apiUrl =
            'http://k8s-msaservices-7d023f0bb9-676035063.ap-northeast-2.elb.amazonaws.com/api/team3/analytics/chatbot/basic-chatbot-request';

        axios
            .post(apiUrl, { category, question })
            .then((response) => {
                const data = response.data;
                let answerMessage = data.message || '응답이 없습니다.';
                let relevantInfo = '';

                if (data.answer) {
                    answerMessage = data.answer;
                }

                if (data.relevant_documents && data.relevant_documents.length > 0) {
                    relevantInfo = '다음 문서를 참고하여 답변되었습니다:\n\n';
                    data.relevant_documents.forEach((doc: any) => {
                        relevantInfo += `-   ${doc.document} (유사도: ${
                            doc.similarity ? doc.similarity.toFixed(2) : 'N/A'
                        })\n`;
                    });
                }

                const finalMessage = this.createChatBotMessage(answerMessage + '\n' + relevantInfo);
                this.setState((prev: any) => ({
                    ...prev,
                    messages: [...prev.messages, finalMessage],
                }));
            })
            .catch((error) => {
                let errorMessage = '오류가 발생했습니다.';
                if (error.response) {
                    errorMessage = `오류: ${error.response.status} - ${
                        error.response.data.message || '서버 오류'
                    }`;
                } else if (error.request) {
                    errorMessage = '요청에 실패했습니다. 네트워크 연결을 확인해주세요.';
                } else {
                    errorMessage = `오류: ${error.message}`;
                }
                const errorMessageObj = this.createChatBotMessage(errorMessage);
                this.setState((prev: any) => ({
                    ...prev,
                    messages: [...prev.messages, errorMessageObj],
                }));
            });
    };
}

export default ActionProvider;
