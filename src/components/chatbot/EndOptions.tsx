import React from 'react';
import { ReferenceDocumentsPayload } from './ReferenceDocuments'; // Correctly import the payload type

export interface EndOptionsProps {
  payload: ReferenceDocumentsPayload;
  actionProvider: any;
}

const EndOptions: React.FC<EndOptionsProps> = ({ payload, actionProvider }) => {
  const handleShowReferences = () => {
    actionProvider.handleShowReferences(payload);
  };

  const handleShowCot = () => {
    actionProvider.handleShowCot(payload);
  };

  return (
    <div style={{ display: 'flex', padding: '2px 0', marginTop: '8px', marginLeft: '55px' }}>
      {/* payload?.references && Array.isArray(payload.references) && payload.references.length > 0
        이 조건을 사용하면 payload.references가 undefined가 아니고, 배열이며, 길이가 0보다 큰 경우에만 실행됩니다.
      */}
      {payload?.references && Array.isArray(payload.references) && payload.references.length > 0 && (
        <button
          onClick={handleShowReferences}
          style={{
            backgroundColor: '#ede7f6',
            border: '1px solid #9575cd',
            borderRadius: 4,
            padding: 10,
            cursor: 'pointer',
            fontSize: 14,
            marginRight: 10,
          }}
        >
          📄 참고 문서
        </button>
      )}
      {payload?.cot && (
        <button
          onClick={handleShowCot}
          style={{
            backgroundColor: '#fff3e0',
            border: '1px solid #ffb74d',
            borderRadius: 4,
            padding: 10,
            cursor: 'pointer',
            fontSize: 14,
            marginRight: 10,
          }}
        >
          🧠 추론 과정
        </button>
      )}
      <button
        onClick={actionProvider.handleNewQuestion}
        style={{
          backgroundColor: '#c8e6c9',
          border: '1px solid #81c784',
          borderRadius: 4,
          padding: 10,
          cursor: 'pointer',
          fontSize: 14,
        }}
      >
        ❓ 추가 질문
      </button>
    </div>
  );
};

export default EndOptions;