import React from 'react';

interface EndOptionsProps {
    actionProvider: any;
}

const EndOptions: React.FC<EndOptionsProps> = ({ actionProvider }) => {
    return (
        <div style={{ display: 'flex', gap: '10px' }}>
             <button onClick={actionProvider.handleEndChat}>👋 종료</button>
            <button onClick={actionProvider.handleNewQuestion}>❓ 추가 질문</button>
        </div>
    );
};

export default EndOptions;