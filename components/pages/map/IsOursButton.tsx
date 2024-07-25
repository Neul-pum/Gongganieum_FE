import { useRouter } from 'next/router';
import { IconStar } from 'public/icons';

const IsOursButton = () => {
  const router = useRouter();
  const selected = router.query['isours'] === 'true';

  const handleClick = () => {
    const {
      q = '',
      as = '지역명',
      cate = '전체',
      iscurrent = false,
    } = router.query;
    router.push(
      `/map?as=${as}&q=${q}&order=&cate=${cate}&isours=${!selected}&iscurrent=${iscurrent}&isliked=false&page=`,
    );
  };

  return (
    <button
      type='button'
      onClick={handleClick}
      className={`flex h-full shrink-0 items-center gap-8 rounded-full pl-16 pr-20 text-16 font-600 shadow-lg md:pl-12 md:pr-16 md:text-14 ${selected ? 'bg-black text-white' : 'bg-white text-black'}`}
    >
      <IconStar fill='#ffc815' />
      직영 건물
    </button>
  );
};

export default IsOursButton;
