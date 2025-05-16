import React from 'react';

export interface ReferenceDocumentsProps {
    payload: any[];
    actionProvider: any;
}

const ReferenceDocuments: React.FC<ReferenceDocumentsProps> = ({ payload, actionProvider }) => {
    const handleClick = () => {
        actionProvider.handleShowReferences(payload);
    };

    return (
        <button onClick={handleClick} style={{ backgroundColor: '#ede7f6', border: '1px solid #9575cd', borderRadius: 4, padding: 10, cursor: 'pointer', fontSize: 14 }}>
            📄 참고문서 확인
        </button>
    );
};

export default ReferenceDocuments;