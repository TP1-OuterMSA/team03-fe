class MessageParser {
    actionProvider: any;

    constructor(actionProvider: any) {
        this.actionProvider = actionProvider;
    }

    parse(message: string) {
        // 사용자의 메시지를 파싱하여 actionProvider의 해당 액션을 호출
        this.actionProvider.handleGeneralMessage(message); // 일반 메시지 처리
    }
}

export default MessageParser;
