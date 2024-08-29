import { useQuery } from '@tanstack/react-query';
import { ROOT_IMAGE_URL } from 'constants/common';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import usePreserveScroll from 'hooks/usePreserveScroll';
import { getBuildingInfo, getLikeBuildingIds } from 'apis/api';
import BuildingTitle from 'components/commons/BuildingTitle';
import ImageLayout from 'components/commons/ImageLayout';
import MetaTag from 'components/commons/MetaTag';
import Description from 'components/commons/description/Description';
import ContactBox from 'components/pages/list/[id]/ContactBox';
import { IconArrowBack } from 'public/icons';

const BuildingDescriptionPage = () => {
  usePreserveScroll();
  const router = useRouter();
  const { id } = router.query as { id: string };
  const buildingId = Number(id);

  const { data: buildingInfo } = useQuery({
    queryKey: ['buildingInfo', buildingId],
    queryFn: () => getBuildingInfo(buildingId),
    enabled: !!buildingId,
  });

  const imageUrls = buildingInfo?.img
    ?.split(',')
    ?.map((url) => ROOT_IMAGE_URL + url);

  const handleGoBack = () => {
    router.back();
  };

  const { data: likeBuildingIds } = useQuery({
    queryKey: ['user', 'likeBuildingIds'],
    queryFn: () => getLikeBuildingIds(),
  });

  const [initialIsLiked, setInitialIsLiked] = useState(false);

  useEffect(() => {
    setInitialIsLiked(likeBuildingIds?.includes(buildingId) ?? false);
  }, [likeBuildingIds, buildingId]);

  return (
    <>
      <MetaTag
        title={`공간이음${buildingInfo?.name ? ` | ${buildingInfo?.name}` : ''}`}
      />
      <div className='mx-auto max-w-1280 px-24 pb-76 pt-56 md:p-24'>
        <button
          type='button'
          onClick={handleGoBack}
          className='mb-24 flex items-center gap-8 text-14 font-700 md:mb-16'
        >
          <IconArrowBack />
          뒤로가기
        </button>
        <ImageLayout imageUrls={imageUrls} page='description' />
        <div className='my-56 flex gap-56 md:my-24'>
          <div className='w-776 shrink-0 md:w-full'>
            <BuildingTitle buildingInfo={buildingInfo} page='description' />
            <Description
              popups={buildingInfo?.popups ?? []}
              address={buildingInfo?.address ?? ''}
              coord={buildingInfo?.coord?.split(',') ?? []}
              page='description'
            />
          </div>
          <ContactBox
            name={buildingInfo?.name ?? ''}
            address={buildingInfo?.address ?? ''}
            id={buildingId}
            initialIsLiked={initialIsLiked}
            scanUrl={buildingInfo?.scanUrl ?? ''}
          />
        </div>
      </div>
    </>
  );
};

export default BuildingDescriptionPage;
