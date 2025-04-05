export const theme = {
  colors: {
    primary: '#228be6',
    secondary: '#868e96',
    success: '#40c057',
    danger: '#fa5252',
    warning: '#fab005',
    background: '#f8f9fa',
    text: {
      primary: '#333',
      secondary: '#495057',
      light: '#868e96',
    },
    border: '#eee',
    hover: '#f1f3f5',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '16px',
  },
  typography: {
    fonts: {
      light: 'Gmarket-Light',
      medium: 'Gmarket-Medium',
      bold: 'Gmarket-Bold',
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '24px',
      xxl: '32px',
    },
    lineHeight: {
      tight: '1.2',
      normal: '1.5',
      relaxed: '1.75',
    },
    letterSpacing: {
      tight: '-0.05em',
      normal: '0',
      wide: '0.05em',
    },
  },
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.12)',
    md: '0 4px 6px rgba(0,0,0,0.1)',
    lg: '0 10px 15px rgba(0,0,0,0.1)',
  },
  transitions: {
    default: '0.2s ease-in-out',
  },
  breakpoints: {
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1280px',
  },
} as const;

export type Theme = typeof theme;

// styled-components에서 테마 타입 지원을 위한 설정
declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
