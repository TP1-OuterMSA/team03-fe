import React from 'react';

export interface FoodOptionsProps {
    actionProvider: any;
}

const FoodOptions: React.FC<FoodOptionsProps> = (props) => {
    const handleMealClick = () => {
        props.actionProvider.handleCategorySelect('FOOD_INFO');
    };

    const handleFeedbackClick = () => {
        props.actionProvider.handleCategorySelect('FOOD_FEEDBACK_INFO');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 16 }}>
            <button onClick={handleMealClick} style={{ backgroundColor: '#f9fbe7', border: '1px solid #cddc39', borderRadius: 4, padding: 12, cursor: 'pointer', fontSize: 16 }}>
                🍱 급식 정보
            </button>
            <button onClick={handleFeedbackClick} style={{ backgroundColor: '#e0f7fa', border: '1px solid #4dd0e1', borderRadius: 4, padding: 12, cursor: 'pointer', fontSize: 16 }}>
                📝 급식 피드백
            </button>
        </div>
    );
};

export default FoodOptions;