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
         <div style={{ display: 'flex', gap: '10px', padding: '2px 0', justifyContent: 'center', marginTop: '8px', marginLeft: '40px' }}> {/* padding-top, padding-bottom만 조정 및 marginTop 추가 */}
            <button onClick={handleMealClick} style={{ backgroundColor: '#f9fbe7', border: '1px solid #cddc39', borderRadius: 4, padding: 12, cursor: 'pointer', fontSize: 14 }}>
                🍱 급식 정보
            </button>
            <button onClick={handleFeedbackClick} style={{ backgroundColor: '#e0f7fa', border: '1px solid #4dd0e1', borderRadius: 4, padding: 12, cursor: 'pointer', fontSize: 14 }}>
                📝 급식 피드백
            </button>
        </div>
    );
};

export default FoodOptions;