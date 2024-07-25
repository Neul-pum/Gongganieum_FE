import { NOT_FOUND_PAGE_IMAGE_URL } from 'constants/common';
import Image from 'next/image';
import Link from 'next/link';
import MetaTag from 'components/commons/MetaTag';

const Custom404 = () => {
  return (
    <>
      <MetaTag />
      <div className='flex h-[75dvh] w-full flex-col items-center justify-center'>
        <div className='relative h-360 w-360 md:h-240 md:w-240'>
          <Image src={NOT_FOUND_PAGE_IMAGE_URL} alt='404 페이지' fill />
        </div>
        <h1 className='mb-12 text-32 font-800 md:text-20'>
          해당 페이지를 찾을 수 없습니다
        </h1>
        <Link
          href='/'
          className='flex items-center justify-center gap-8 border-b-4 border-black px-4 py-4 text-16 font-600 md:text-12'
        >
          홈으로
        </Link>
      </div>
    </>
  );
};

export default Custom404;
