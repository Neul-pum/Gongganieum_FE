import { useQuery } from '@tanstack/react-query';
import { CATEGORY } from 'constants/common';
import useInitMap from 'hooks/map/useInitMap';
import usePreventScroll from 'hooks/usePreventScroll';
import { getAllBuildingInfos } from 'apis/api';
import MetaTag from 'components/commons/MetaTag';
import FilterButton from 'components/pages/map/FilterButton';
import IsOursButton from 'components/pages/map/IsOursButton';
import LikedButton from 'components/pages/map/LikedButton';
import Tab from 'components/pages/map/Tab';

const Map = () => {
  const { data: buildings } = useQuery({
    queryKey: ['buildings'],
    queryFn: getAllBuildingInfos,
  });

  useInitMap(buildings);

  usePreventScroll();

  return (
    <>
      <MetaTag title='공간이음 | 지도' />
      <div className='relative flex h-[calc(100dvh-72px)] w-full justify-end overflow-hidden'>
        <div className='fixed left-432 top-92 z-nav flex h-40 gap-12 scrollbar-hide md:left-0 md:top-56 md:h-72 md:w-full md:gap-8 md:overflow-x-auto md:overflow-y-hidden md:py-20'>
          <div />
          <IsOursButton />
          <LikedButton buildings={buildings ?? []} />
          {CATEGORY.map((category) => (
            <FilterButton key={category} category={category} />
          ))}
          <div />
        </div>
        <Tab />
        <div id='map' className='h-full w-full' />
      </div>
    </>
  );
};

export default Map;
