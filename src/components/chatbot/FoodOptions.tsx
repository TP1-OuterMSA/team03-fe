import React from 'react';

interface FoodOptionsProps {
    actionProvider: {
        handleCategorySelect: (category: 'FOOD_INFO' | 'FOOD_FEEDBACK_INFO') => void;
    };
}

const FoodOptions: React.FC<FoodOptionsProps> = (props) => {
    const handleMealClick = () => {
        props.actionProvider.handleCategorySelect('FOOD_INFO');
    };

    const handleFeedbackClick = () => {
        props.actionProvider.handleCategorySelect('FOOD_FEEDBACK_INFO');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button onClick={handleMealClick}>🍱 급식 정보</button>
            <button onClick={handleFeedbackClick}>📝 급식 피드백</button>
        </div>
    );
};

export default FoodOptions;