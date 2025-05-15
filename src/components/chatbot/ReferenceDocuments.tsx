import React from 'react';

interface ReferenceDocumentsProps {
    payload: any[];
    actionProvider: any;
}

const ReferenceDocuments: React.FC<ReferenceDocumentsProps> = ({ payload, actionProvider }) => {
    const handleClick = () => {
        actionProvider.handleShowReferences(payload);
    };

    return (
        <button onClick={handleClick}> 📄참고문서 확인</button>
    );
};

export default ReferenceDocuments;