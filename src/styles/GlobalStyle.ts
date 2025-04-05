import { createGlobalStyle } from 'styled-components';

// 폰트 파일 import
import GmarketBold from '../assets/fonts/GmarketSansTTFBold.ttf';
import GmarketMedium from '../assets/fonts/GmarketSansTTFMedium.ttf';
import GmarketLight from '../assets/fonts/GmarketSansTTFLight.ttf';

const GlobalStyle = createGlobalStyle`
  /* 폰트 설정 */
  @font-face {
    font-family: 'Gmarket-Light';
    src: url(${GmarketLight}) format('truetype');
    font-style: normal;
  }

  @font-face {
    font-family: 'Gmarket-Medium';
    src: url(${GmarketMedium}) format('truetype');
    font-style: normal;
  }

  @font-face {
    font-family: 'Gmarket-Bold';
    src: url(${GmarketBold}) format('truetype');
    font-style: normal;
  }

  /* Reset CSS */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Gmarket-Medium', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.5;
    background-color: #f8f9fa;
    color: #333;
  }

  /* 랭킹 테이블 관련 공통 스타일 */
  .ranking-row {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid #eee;
    transition: background-color 0.2s;

    &:hover {
      background-color: #f1f3f5;
    }
  }

  /* 순위 변동 화살표 스타일 */
  .rank-change {
    &.up {
      color: #40c057;
    }
    &.down {
      color: #fa5252;
    }
    &.same {
      color: #868e96;
    }
  }

  /* 점수 표시 스타일 */
  .score {
    font-family: 'Gmarket-Bold';
    color: #495057;
  }

  /* 탭 메뉴 스타일 */
  .tab-menu {
    display: flex;
    gap: 8px;
    margin-bottom: 24px;
  }

  /* 버튼 공통 스타일 */
  button {
    cursor: pointer;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    font-family: 'Gmarket-Medium';
    transition: all 0.2s;

    &.primary {
      background-color: #228be6;
      color: white;
      &:hover {
        background-color: #1c7ed6;
      }
    }
  }

  /* 프로그레스 바 스타일 */
  .progress-bar {
    height: 8px;
    background-color: #e9ecef;
    border-radius: 4px;
    overflow: hidden;
  }

  /* 메달 아이콘 스타일 */
  .medal {
    &.gold {
      color: #ffd700;
    }
    &.silver {
      color: #c0c0c0;
    }
    &.bronze {
      color: #cd7f32;
    }
  }

  /* 입력 요소 공통 스타일 */
  input, select, textarea {
    font-family: 'Gmarket-Medium';
  }

  /* 제목 스타일 */
  h1, h2, h3, h4, h5, h6 {
    font-family: 'Gmarket-Bold';
  }
`;

export default GlobalStyle;
