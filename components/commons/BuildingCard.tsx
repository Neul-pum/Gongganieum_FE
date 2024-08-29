import { NO_IMAGE_URL, ROOT_IMAGE_URL } from 'constants/common';
import Image from 'next/image';
import Link from 'next/link';
import useLike from 'hooks/useLike';
import { BuildingType } from 'types/client.types';
import Tag from 'components/commons/Tag';
import { IconBlankLike, IconRedLike } from 'public/icons';

type LikeType = 'like' | 'home' | 'none';

const BuildingCard = (props: {
  mode: LikeType;
  _id: number;
  building: BuildingType;
  isLiked?: boolean;
}) => {
  const { mode, _id, isLiked: initialIsLiked, building } = props;

  const { name, address, isours, tag, cate, img, latest_end_date } = building;

  const isPopup = new Date(latest_end_date ?? '') > new Date();
  const parsedTags = tag === 'NULL' ? [] : tag?.split(',');
  const imageSrc = img?.split(',')?.map((url: string) => ROOT_IMAGE_URL + url);

  const { isLiked, handleLike } = useLike({
    initialIsLiked: initialIsLiked ?? false,
    id: _id,
  });

  return (
    <Link
      href={`/list/${_id}`}
      className='relative flex aspect-square w-full cursor-pointer flex-col text-start'
    >
      <div
        className={`relative mb-20 h-full w-full overflow-hidden rounded-12 md:mb-12 ${mode === 'home' && 'md:w-240'}`}
      >
        <Image
          src={imageSrc?.[0] ?? NO_IMAGE_URL}
          fill
          className='object-cover'
          alt='빌딩 이미지'
          quality={100}
        />
        {/* 찜하기 버튼 */}
        {mode === 'like' && (
          <button
            className='absolute right-20 top-20 z-[2] md:right-12 md:top-12'
            onClick={handleLike}
          >
            {isLiked ? <IconRedLike /> : <IconBlankLike />}
          </button>
        )}
      </div>
      <Description name={name} address={address} />
      <div className='flex flex-wrap gap-8'>
        {Boolean(isours) && <Tag type='직영' />}
        {isPopup && <Tag type='팝업진행중' />}
        <Tag type='카테고리' text={cate} />
        {parsedTags?.map((tag) => <Tag key={tag} type='일반' text={tag} />)}
      </div>
      <div className='flex flex-wrap gap-8'></div>
    </Link>
  );
};

export default BuildingCard;

const Description = (props: { name: string; address: string }) => {
  const { name, address } = props;

  return (
    <div className='mb-12 flex flex-col gap-4'>
      <h3 className='line-clamp-1 text-20 font-700 md:text-18'>{name}</h3>
      <span className='line-clamp-1 text-16 text-gray-400 md:text-14'>
        {address}
      </span>
    </div>
  );
};
