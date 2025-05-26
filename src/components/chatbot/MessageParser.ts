class MessageParser {
    actionProvider: any;

    constructor(actionProvider: any) {
        this.actionProvider = actionProvider;
    }

    parse(message: string) {
        this.actionProvider.handleGeneralMessage(message); // 일반 메시지 처리
    }
}

export default MessageParser;
