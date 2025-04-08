import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getMenuRankings, getTrendingMenus } from '../api/menuService';
import { MenuRankingData, RankingPeriod, MenuRankingItem, TrendingMenuData } from '../interface/menu';
import RankingList from '../components/ranking/RankingList';
import TrendingMenus from '../components/ranking/TrendingMenus';
import WantedMenus from '../components/ranking/WantedMenus';

const MenuRanking = () => {
  const [period, setPeriod] = useState<RankingPeriod>('WEEKLY');
  const [topRankings, setTopRankings] = useState<MenuRankingData[]>([]);
  const [bottomRankings, setBottomRankings] = useState<MenuRankingData[]>([]);
  const [trendingMenus, setTrendingMenus] = useState<TrendingMenuData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [rankingsResponse, trendingResponse] = await Promise.all([
          getMenuRankings(period),
          getTrendingMenus(period),
        ]);

        const mapRankingItemToData = (item: MenuRankingItem): MenuRankingData => ({
          menuId: item.id,
          menuName: item.name,
          score: item.score,
          rankChange: item.rankChange,
        });

        const mapRankingItemToTrendingData = (item: MenuRankingItem): TrendingMenuData => ({
          menuId: item.id,
          menuName: item.name,
          score: item.score,
          rankChange: item.rankChange,
        });

        setTopRankings(rankingsResponse.data.topRankMenuResponseDto.map(mapRankingItemToData));
        setBottomRankings(rankingsResponse.data.bottomRankMenuResponseDto.map(mapRankingItemToData));
        setTrendingMenus(trendingResponse.data.map(mapRankingItemToTrendingData));
      } catch (err) {
        console.error('데이터를 불러오는데 실패했습니다:', err);
        setError('데이터를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period]);

  return (
    <MenuRankingContainer>
      <RankingHeader>
        <h1>메뉴 랭킹</h1>
        <PeriodToggle>
          <ToggleButton $active={period === 'WEEKLY'} onClick={() => setPeriod('WEEKLY')}>
            주간
          </ToggleButton>
          <ToggleButton $active={period === 'MONTHLY'} onClick={() => setPeriod('MONTHLY')}>
            월간
          </ToggleButton>
        </PeriodToggle>
      </RankingHeader>

      {loading ? (
        <LoadingText>로딩 중...</LoadingText>
      ) : error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : (
        <>
          <RankingsContainer>
            <RankingList title="인기 메뉴 TOP 5" items={topRankings} />
            <RankingList title="하위 메뉴 TOP 5" items={bottomRankings} />
          </RankingsContainer>
          <TrendingMenus title="급상승 메뉴 TOP 3" items={trendingMenus} />
          <WantedMenus title="먹고싶은 메뉴 TOP 3" items={topRankings} />
        </>
      )}
    </MenuRankingContainer>
  );
};

const MenuRankingContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  max-width: 1200px;
  margin: 0 auto;
  margin-top: 2rem;
`;

const RankingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 24px;
    font-weight: 600;
    color: #333;
  }
`;

const PeriodToggle = styled.div`
  display: flex;
  background: #f0f0f0;
  border-radius: 20px;
  padding: 4px;
`;

const ToggleButton = styled.button<{ $active: boolean }>`
  padding: 8px 16px;
  border-radius: 16px;
  border: none;
  background: ${(props) => (props.$active ? '#fff' : 'transparent')};
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${(props) => (props.$active ? '0 2px 4px rgba(0,0,0,0.1)' : 'none')};
`;

const RankingsContainer = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #dc3545;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 1rem 0;
`;

export default MenuRanking;
