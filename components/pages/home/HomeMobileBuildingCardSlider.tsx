import { useQuery } from '@tanstack/react-query';
import { ScrollContainer } from 'react-indiana-drag-scroll';
import 'react-indiana-drag-scroll/dist/style.css';
import { getHomeCarousel } from 'apis/api';
import { CarouselType } from 'types/client.types';
import BuildingCard from 'components/commons/BuildingCard';

const HomeMobileBuildingCardSlider = (props: {
  mode: 'primary' | 'secondary';
}) => {
  const { mode } = props;

  const { data: carouselData } = useQuery({
    queryKey: ['carousels', mode],
    queryFn: () => getHomeCarousel(mode),
  });

  return (
    // scrollbar-hide 사용
    <div className='hidden h-340 w-[100dvw] whitespace-nowrap scrollbar-hide md:flex md:overflow-x-scroll'>
      <ScrollContainer className='md:flex md:gap-16 md:px-24'>
        {carouselData?.map((building: CarouselType) => {
          return (
            <BuildingCard
              mode='home'
              key={building._id}
              _id={building.contentId}
              building={building.content}
            />
          );
        })}
      </ScrollContainer>
    </div>
  );
};

export default HomeMobileBuildingCardSlider;
