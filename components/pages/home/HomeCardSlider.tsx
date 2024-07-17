import { useQuery } from '@tanstack/react-query';
import { useRef } from 'react';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import { Autoplay, Navigation } from 'swiper/modules';
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';
import { getHomeCarousel } from 'apis/api';
import BuildingCard from 'components/commons/BuildingCard';
import { IconArrowNextButton, IconArrowPrevButton } from 'public/icons';

const HomeCardSlider = (props: { mode: 'primary' | 'secondary' }) => {
  const { mode } = props;
  const swiperRef = useRef<SwiperRef>(null);

  const { data: primaryCarouselData } = useQuery({
    queryKey: ['primary-carousel'],
    queryFn: () => getHomeCarousel('primary'),
  });

  const { data: secondaryCarouselData } = useQuery({
    queryKey: ['secondary-carousel'],
    queryFn: () => getHomeCarousel('secondary'),
  });

  const carouselData =
    mode === 'primary' ? primaryCarouselData : secondaryCarouselData;

  console.log('carouselData', carouselData);

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
        {carouselData?.map((building: any, index: number) => {
          return (
            <SwiperSlide key={building._id} virtualIndex={index}>
              <BuildingCard
                mode='home'
                key={building._id}
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
