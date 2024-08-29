import { useQuery } from '@tanstack/react-query';
import { ROOT_IMAGE_URL } from 'constants/common';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useStore } from 'store';
import { getBuildingInfo, getLikeBuildingIds } from 'apis/api';
import BuildingTitle from 'components/commons/BuildingTitle';
import ImageLayout from 'components/commons/ImageLayout';
import Description from 'components/commons/description/Description';
import { IconArrowBack } from 'public/icons';
import ContactBox from './ContactBox';

const BuildingTab = (props: { id: number }) => {
  const { id } = props;
  const { map } = useStore((state) => ({
    map: state.map,
  }));

  const { data: buildingInfo } = useQuery({
    queryKey: ['buildingInfo', id],
    queryFn: () => getBuildingInfo(id),
  });

  useEffect(() => {
    if (!buildingInfo || !map) {
      return;
    }

    const coord = buildingInfo.coord.split(',');
    const position = new window.kakao.maps.LatLng(Number(coord[0]), coord[1]);

    const imageSrc = '/icons/selected-pin.svg';
    const imageSize = new window.kakao.maps.Size(62, 62);
    const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize);

    const marker = new window.kakao.maps.Marker({
      map,
      position,
      image: markerImage,
      zIndex: 100,
    });

    return () => {
      marker.setMap(null);
    };
  }, [map, buildingInfo]);

  const router = useRouter();
  const handleGoBack = () => {
    router.back();
  };

  const imageUrls = buildingInfo?.img
    ?.split(',')
    ?.map((url) => ROOT_IMAGE_URL + url);

  const { data: likeBuildingIds } = useQuery({
    queryKey: ['user', 'likeBuildingIds'],
    queryFn: () => getLikeBuildingIds(),
  });

  const [initialIsLiked, setInitialIsLiked] = useState(false);

  useEffect(() => {
    setInitialIsLiked(likeBuildingIds?.includes(id) ?? false);
  }, [likeBuildingIds, id]);

  return (
    <div className='flex h-full w-full flex-col overflow-y-auto overflow-x-hidden p-24 md:p-0 md:pb-100'>
      <button
        type='button'
        onClick={handleGoBack}
        className='mb-24 flex items-center gap-8 text-14 font-700 md:mb-16'
      >
        <IconArrowBack />
        뒤로가기
      </button>
      <ImageLayout imageUrls={imageUrls} page='map' />
      <BuildingTitle buildingInfo={buildingInfo} page='map' />
      <div className='flex flex-col gap-24'>
        <Description
          popups={buildingInfo?.popups ?? []}
          address={buildingInfo?.address ?? ''}
          coord={buildingInfo?.coord?.split(',') ?? []}
          page='map'
        />
      </div>
      <ContactBox id={id} initialIsLiked={initialIsLiked} />
    </div>
  );
};

export default BuildingTab;
