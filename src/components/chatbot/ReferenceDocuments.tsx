import React from 'react';
import styled from 'styled-components';

export interface ReferenceDocumentsProps {
    payload: any[];
    actionProvider: any;
}

const ReferenceDocumentButtonWrapper = styled.div`
    display: flex;
    justify-content: flex-start; /* 왼쪽 정렬 유지 */
    margin-top: 8px; /* 메시지와의 간격 조절 */
    margin-left: 55px;
`;

const ReferenceDocumentButton = styled.button`
    background-color: #ede7f6;
    border: 1px solid #9575cd;
    border-radius: 4px;
    padding: 10px;
    cursor: pointer;
    font-size: 14px;
    align-self: flex-start;
`;

const ReferenceDocuments: React.FC<ReferenceDocumentsProps> = ({ payload, actionProvider }) => {
    const handleClick = () => {
        actionProvider.handleShowReferences(payload);
    };

    return (
        <ReferenceDocumentButtonWrapper>
            <ReferenceDocumentButton onClick={handleClick}>
                📄 참고문서 확인
            </ReferenceDocumentButton>
        </ReferenceDocumentButtonWrapper>
    );
};

export default ReferenceDocuments;