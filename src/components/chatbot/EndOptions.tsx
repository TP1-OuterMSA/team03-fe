import React from 'react';
import { ReferenceDocumentsProps } from './ReferenceDocuments'; // 타입 정의 임포트

export interface EndOptionsProps extends ReferenceDocumentsProps {
  actionProvider: any;
}

const EndOptions: React.FC<EndOptionsProps> = ({ payload, actionProvider }) => {
  const handleClick = () => {
    actionProvider.handleShowReferences(payload);
  };

  return (
    <div style={{ display: 'flex', padding: '2px 0', marginTop: '8px', marginLeft: '55px' }}> {/* justifyContent: 'center' 제거 */}
      {payload && payload.length > 0 && (
        <button onClick={handleClick} style={{ backgroundColor: '#ede7f6', border: '1px solid #9575cd', borderRadius: 4, padding: 10, cursor: 'pointer', fontSize: 14, marginRight: 10 }}>
          📄 참고 문서
        </button>
      )}
      <button onClick={actionProvider.handleNewQuestion} style={{ backgroundColor: '#c8e6c9', border: '1px solid #81c784', borderRadius: 4, padding: 10, cursor: 'pointer', fontSize: 14 }}>
        ❓ 추가 질문
      </button>
    </div>
  );
};

export default EndOptions;