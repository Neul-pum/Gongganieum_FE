import { useQuery } from '@tanstack/react-query';
import { useRef } from 'react';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import { Autoplay, Navigation } from 'swiper/modules';
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';
import { getHomeCarousel } from 'apis/api';
import { CarouselType } from 'types/client.types';
import BuildingCard from 'components/commons/BuildingCard';
import { IconArrowNextButton, IconArrowPrevButton } from 'public/icons';

const HomeCardSlider = (props: { mode: 'primary' | 'secondary' }) => {
  const { mode } = props;
  const swiperRef = useRef<SwiperRef>(null);

  const { data: primaryCarouselData } = useQuery<CarouselType[]>({
    queryKey: ['carousels', 'primary-carousel'],
    queryFn: () => getHomeCarousel('primary'),
  });

  const { data: secondaryCarouselData } = useQuery<CarouselType[]>({
    queryKey: ['carousels', 'secondary-carousel'],
    queryFn: () => getHomeCarousel('secondary'),
  });

  const carouselData: CarouselType[] | undefined =
    mode === 'primary' ? primaryCarouselData : secondaryCarouselData;

  const handlePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slideNext();
    }
  };

  return (
    <div className='relative h-508 w-[calc(100dvw-32px)] max-w-1232 md:hidden'>
      <Swiper
        ref={swiperRef}
        modules={[Navigation, Autoplay]}
        navigation={{ nextEl: null, prevEl: null }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        spaceBetween={30}
        slidesPerView={3}
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        className='h-full w-full'
      >
        {carouselData?.map((building: CarouselType, index: number) => {
          return (
            <SwiperSlide key={building._id} virtualIndex={index}>
              <BuildingCard
                mode='home'
                key={building._id}
                _id={building.contentId}
                building={building.content}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
      <button
        onClick={handlePrev}
        className='absolute -left-24 top-1/3 z-base	md:hidden'
      >
        <IconArrowPrevButton />
      </button>
      <button
        onClick={handleNext}
        className='absolute -right-24 top-1/3	 z-base md:hidden'
      >
        <IconArrowNextButton />
      </button>
    </div>
  );
};

export default HomeCardSlider;
