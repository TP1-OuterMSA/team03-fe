import axios from 'axios';

class ActionProvider {
  createChatBotMessage: any;
  setState: any;

  constructor(createChatBotMessage: any, setStateFunc: any) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }

  handleGeneralMessage = (question: string) => {
    this.setState((prevState: any) => {
      if (!prevState.category) {
        const errorMessage = this.createChatBotMessage('먼저 급식 정보 또는 급식 피드백 중에서 선택해주세요.');
        return {
          ...prevState,
          messages: [...prevState.messages, errorMessage],
        };
      }
      const processingMessage = this.createChatBotMessage('잠시만 기다려주세요', { delay: 0 });
      this.setState((prev: any) => ({ ...prev, messages: [...prev.messages, processingMessage] }));
      this.handleApiResponse(prevState.category, question);
      return prevState;
    });
  };

  handleApiResponse = (category: string, question: string) => {
    const apiUrl =
      'http://k8s-msaservices-7d023f0bb9-676035063.ap-northeast-2.elb.amazonaws.com/api/team3/analytics/chatbot/basic-chatbot-request';

    axios
      .post(apiUrl, { category, question })
      .then((response) => {
        const data = response.data;
        let answerMessage = data.answer || '답변이 없습니다.';
        answerMessage = answerMessage.replace(/\|n\|n/g, '\n\n').replace(/\\nln/g, '\n');
        const referenceDocuments = data.relevant_documents;

        const finalMessage = this.createChatBotMessage(answerMessage, {
          payload: referenceDocuments,
          delay: 0,
        });

        this.setState((prev: any) => ({
          ...prev,
          messages: prev.messages.filter((msg: { message: string }) => msg.message !== '잠시만 기다려주세요').concat([finalMessage, this.createChatBotMessage('더 궁금한 것이 있으신가요?', { widget: 'endOptions', withAvatar: true, payload: referenceDocuments, delay: 0 })]),
        }));
      })
      .catch((error) => {
        const errorMessage = this.createChatBotMessage(`오류가 발생했습니다: ${error.message}`, { delay: 0 });
        this.setState((prev: any) => ({
          ...prev,
          messages: prev.messages.filter((msg: { message: string }) => msg.message !== '잠시만 기다려주세요').concat([errorMessage]),
        }));
      });
  };

  handleCategorySelect = (category: string) => {
    this.setState((prevState: any) => ({
      ...prevState,
      category: category,
      messages: [
        ...prevState.messages,
        this.createChatBotMessage(
          `선택하신 카테고리는 ${
            category === 'FOOD_INFO' ? '급식 정보' : '급식 피드백'
          }입니다. 질문을 입력하세요.`,
          { withAvatar: true, delay: 0, widget: undefined }
        ),
      ],
    }));
  };

  handleEndChat = () => {
    this.setState((prev: any) => ({
      ...prev,
      messages: [...prev.messages, this.createChatBotMessage('종료되었습니다.', { delay: 0 })],
    }));
  };

  handleNewQuestion = () => {
    this.setState((prev: any) => ({
      ...prev,
      category: null,
      messages: [
        ...prev.messages,
        this.createChatBotMessage('새로운 질문을 시작합니다. 아래 카테고리 중 하나를 선택해주세요', {
          withAvatar: true,
          delay: 0,
          widget: 'foodOptions',
        }),
      ],
    }));
  };

  handleShowReferences = (references: any[]) => {
    let referenceText = '참고 문헌:\n\n';
    references.forEach((ref) => {
      referenceText += `- ${ref.document} (유사도: ${ref.similarity ? ref.similarity.toFixed(2) : 'N/A'})\n`;
    });
    this.setState((prev: any) => ({
      ...prev,
      messages: [...prev.messages, this.createChatBotMessage(referenceText, { delay: 0 }), this.createChatBotMessage('더 궁금한 것이 있으신가요?', { widget: 'endOptions', withAvatar: true, payload: [], delay: 0 })],
    }));
  };
}

export default ActionProvider;