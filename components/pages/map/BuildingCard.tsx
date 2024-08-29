import { NO_IMAGE_URL, ROOT_IMAGE_URL } from 'constants/common';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useStore } from 'store';
import { BuildingType } from 'types/client.types';
import Tag from 'components/commons/Tag';

const BuildingCard = (props: { building: BuildingType }) => {
  const { building } = props;

  const router = useRouter();
  const { map } = useStore((state) => ({
    map: state.map,
  }));

  const handleClick = () => {
    if (!map) {
      return;
    }

    const { as, q, cate, isliked, isours } = router.query;
    router.push({
      query: { as, q, cate, isours, isliked, building: building._id },
    });

    const coord = building.coord.split(',');
    const position = new window.kakao.maps.LatLng(coord[0], coord[1]);
    const bound = new window.kakao.maps.LatLngBounds();
    bound.extend(position);
    map.panTo(bound);
  };

  const parsedTags = building?.tag === 'NULL' ? [] : building?.tag?.split(',');
  const isPopup = new Date(building?.latest_end_date ?? '') > new Date();
  const imageUrl = building?.img
    ?.split(',')
    ?.map((url) => ROOT_IMAGE_URL + url);

  return (
    <button
      onClick={handleClick}
      type='button'
      className='border-[rgba(0,0,0,0.06)} flex flex-col rounded-12 border bg-gray-300/5 p-16 text-start'
    >
      <Description name={building?.name} address={building?.address} />
      <div className='mb-12 flex flex-wrap gap-8'>
        {!!building?.isours && <Tag type='직영' />}
        {isPopup && <Tag type='팝업진행중' />}
        <Tag type='카테고리' text={building?.cate} />
        {parsedTags?.map((tag) => <Tag key={tag} type='일반' text={tag} />)}
      </div>
      <div className='relative h-148 w-full overflow-hidden rounded-12'>
        <Image
          src={imageUrl?.[0] ?? NO_IMAGE_URL}
          fill
          className='object-cover'
          alt='빌딩 이미지'
        />
      </div>
    </button>
  );
};

export default BuildingCard;

const Description = (props: { name: string; address: string }) => {
  const { name, address } = props;

  return (
    <div className='mb-8 flex flex-col gap-4'>
      <h3 className='text-18 font-700'>{name}</h3>
      <span className='text-14 text-gray-400'>{address}</span>
    </div>
  );
};
