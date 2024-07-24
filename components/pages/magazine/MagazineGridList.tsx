import Image from 'next/image';

const MagazineGridList = () => {
  return (
    <div className='flex h-full w-full items-start justify-around gap-40 px-40 md:flex-col md:gap-16 md:px-24'>
      <h1 className='border-b-4 border-black text-[50px] font-400 md:text-32'>
        POPUP
      </h1>
      {/* 큰 이미지 카드*/}
      <div className='relative min-h-600 min-w-[25dvw] md:min-h-600 md:w-full'>
        <Image
          src={'/images/mock-son.webp'}
          alt='매거진 표지 이미지'
          fill
          className='object-cover'
        />
        <div className='absolute left-1/2 top-[10%] flex -translate-x-1/2 flex-col gap-12 md:top-[80%]'>
          <h2 className='whitespace-nowrap text-[22px] font-800 text-white md:text-20'>
            {'송민혁과 토트넘 팝업 이벤트에 간다면'}
          </h2>
          <p className='text-16 font-400 text-white md:text-14'>
            {'팝업 정보'} | <span className='opacity-60'>{'2024.07.21'}</span>
          </p>
        </div>
      </div>
      {/* 작은 이미지들 */}
      <div className='grid min-h-600 min-w-680 grid-cols-2 grid-rows-2 gap-x-12 gap-y-24 md:min-h-full md:min-w-full md:grid-cols-1 md:gap-y-12'>
        <SmallCard
          img={'/images/mock-son.webp'}
          category={'팝업 정보'}
          title={'어쩌구저쩌구'}
          writer={'송민혁'}
          date={'2024.07.10'}
        />
        <SmallCard
          img={'/images/mock-son.webp'}
          category={'팝업 정보'}
          title={'어쩌구저쩌구'}
          writer={'송민혁'}
          date={'2024.07.10'}
        />
        <SmallCard
          img={'/images/mock-son.webp'}
          category={'팝업 정보'}
          title={'어쩌구저쩌구'}
          writer={'송민혁'}
          date={'2024.07.10'}
        />
        <SmallCard
          img={'/images/mock-son.webp'}
          category={'팝업 정보'}
          title={'어쩌구저쩌구'}
          writer={'송민혁'}
          date={'2024.07.10'}
        />
      </div>
    </div>
  );
};

export default MagazineGridList;

// TODO: 넣을 데이터 : 이미지, 제목, 작성자, 작성일
const SmallCard = (props: {
  img: string;
  category: string;
  title: string;
  writer: string;
  date: string;
}) => {
  const { img, category, title, writer, date } = props;
  return (
    <div className='flex h-full w-full flex-col gap-8 p-12 md:grid md:grid-cols-2 md:p-0'>
      <div className='relative h-[90%] w-full bg-[#000] md:h-100 md:w-152'>
        <Image
          src={img}
          alt='매거진 표지 이미지'
          fill
          className='object-cover'
        />
      </div>
      <div className='flex flex-col gap-4'>
        <h2 className='text-14 font-600  md:text-12'>{category}</h2>
        <h2 className='w-380 border-b-2 border-white text-[18px] font-800 duration-300 hover:underline md:w-full md:text-14 md:font-700'>
          {title}
        </h2>
        <p className='text-12 font-400 text-gray-300 md:text-[10px]'>
          {date} | {`by ${writer}`}
        </p>
      </div>
    </div>
  );
};
