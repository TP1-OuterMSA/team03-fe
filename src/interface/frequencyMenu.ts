import { PeriodType } from './wantedMenu';

export interface PeriodSelectorProps {
    periodCategory: 'semester' | 'month';
    selectedPeriod: PeriodType;
    onCategoryChange: (category: 'semester' | 'month') => void;
    onPeriodChange: (period: PeriodType) => void;
  }