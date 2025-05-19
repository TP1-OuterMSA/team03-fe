import React from 'react';
import styled from 'styled-components';
import meal from '../../assets/images/sidebar/chatbot/meal.png'; // Ensure the path to your image is correct

const AvatarContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: white;
  margin-left: 5px;
  margin-right: 15px;
  overflow: hidden; /* Clip the image to the border-radius */
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover; /* Ensure the image covers the container */
`;

const CustomBotAvatar: React.FC = () => {
  return (
    <AvatarContainer>
      <AvatarImage src={meal} alt="급식봇 이미지" />
    </AvatarContainer>
  );
};

export default CustomBotAvatar;