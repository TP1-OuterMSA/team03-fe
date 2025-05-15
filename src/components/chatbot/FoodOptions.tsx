import React from 'react';

const FoodOptions = (props: any) => {
    const handleClick = (type: 'meal' | 'feedback') => {
        if (type === 'meal') {
            props.actionProvider.handleMealInfo(type);
        } else if (type === 'feedback') {
            props.actionProvider.handleFeedback(type);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button onClick={() => handleClick('meal')}>🍱 급식 정보</button>
            <button onClick={() => handleClick('feedback')}>📝 급식 피드백</button>
        </div>
    );
};

export default FoodOptions;
