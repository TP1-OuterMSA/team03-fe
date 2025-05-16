import React from 'react';

export interface EndOptionsProps {
    actionProvider: any;
}

const EndOptions: React.FC<EndOptionsProps> = ({ actionProvider }) => {
    return (
        <div style={{ display: 'flex', gap: '10px', padding: 16, justifyContent: 'center' }}>
            <button onClick={actionProvider.handleEndChat} style={{ backgroundColor: '#ffcdd2', border: '1px solid #e57373', borderRadius: 4, padding: 10, cursor: 'pointer', fontSize: 14 }}>
                👋 종료
            </button>
            <button onClick={actionProvider.handleNewQuestion} style={{ backgroundColor: '#c8e6c9', border: '1px solid #81c784', borderRadius: 4, padding: 10, cursor: 'pointer', fontSize: 14 }}>
                ❓ 추가 질문
            </button>
        </div>
    );
};

export default EndOptions;