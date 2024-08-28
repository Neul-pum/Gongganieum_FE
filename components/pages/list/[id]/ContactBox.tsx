import { BASE_URL } from 'constants/common';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import useLike from 'hooks/useLike';
import useOutsideClick from 'hooks/useOutsideClick';
import useSession from 'hooks/useSession';
import {
  IconGrayLike,
  IconKakaoLogo,
  IconLink,
  IconMarker,
  IconRedLike,
  IconShare,
} from 'public/icons';
import RoomTour from 'public/images/3d-room-tour.png';

const ContactBox = (props: {
  name: string;
  address: string;
  id: number;
  initialIsLiked: boolean;
  scanUrl: string;
}) => {
  const { name, address, id, initialIsLiked, scanUrl } = props;

  const { getSession } = useSession();
  const session = getSession();

  const router = useRouter();
  const url = BASE_URL + router.asPath;

  const ref = useRef(null);
  const [isShareVisible, setIsShareVisible] = useOutsideClick(ref, false);

  const handleShareWithKakao = () => {
    window.Kakao.Share.sendDefault({
      objectType: 'text',
      text: '공간이음에서 팝업 건물을 찾아보세요!',
      link: {
        webUrl: url,
      },
    });
    setIsShareVisible(false);
  };

  useEffect(() => {
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_API_KEY);
    }
  }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('클립보드에 복사됐습니다.', { position: 'bottom-center' });
    } catch (err) {
      console.error(err);
      toast.error('에러가 발생했습니다.', { position: 'bottom-center' });
    }
    setIsShareVisible(false);
  };

  const { isLiked, handleLike } = useLike({ id, initialIsLiked });

  return (
    <div
      ref={ref}
      className='sticky top-92 z-nav h-224 w-400 shrink-0 rounded-16 border border-[rgba(0,0,0,0.06)] bg-white p-24 shadow-lg md:fixed md:bottom-0 md:left-0 md:right-0 md:top-auto md:h-92 md:w-screen md:rounded-none'
    >
      <div className='h-44 pb-8 text-24 font-800 md:hidden'>{name}</div>
      <div className='flex h-40 items-center gap-8 pb-16 text-16 font-500 text-gray-400 md:hidden'>
        <IconMarker />
        {address}
      </div>
      <div className='mh-fit flex flex-col gap-8'>
        <div className='flex h-fit gap-8'>
          <button
            onClick={handleLike}
            className='flex shrink-0 items-center justify-center rounded-full border border-[rgba(0,0,0,0.2)]'
          >
            {isLiked ? <IconRedLike /> : <IconGrayLike />}
          </button>
          <button
            onClick={() => setIsShareVisible((prev) => !prev)}
            className='flex h-44 w-44 shrink-0 items-center justify-center rounded-full border border-[rgba(0,0,0,0.2)]'
          >
            <IconShare />
          </button>
          <Link
            href={session ? `/contact/${id}` : '/login?isRedirected=true'}
            className='flex h-44 w-full items-center justify-center rounded-8 bg-black text-16 font-700 text-white'
          >
            문의하기
          </Link>
        </div>
        <section className='z-0 relative'>
          <div
            className='text-center'
            onClick={() => {
              if (!scanUrl) alert('3D스캔 준비중 입니다.');
            }}
          >
            <a
              className='before:-z-10 group flex flex-row flex-col items-center justify-center space-x-[2px] space-y-0 space-y-4 text-16 font-700 text-[#0f172a] text-black  before:absolute before:inset-0 before:transition-colors before:duration-500'
              href={scanUrl ?? '#'}
              target={scanUrl ? '_blank' : '_self'}
            >
              {scanUrl ? (
                <style>
                  {`.border-shine-effect::before { background-image: linear-gradient(90deg, #6366f100 0%, #191f28c9 35%, #ffffff 50%, #191f28c9 65%, #6366f100 100%); }`}
                </style>
              ) : (
                <></>
              )}
              <div className='border-shine-effect relative flex w-full items-center justify-center overflow-hidden rounded-8 bg-[#e2e8f0] p-[1px] transition duration-500 before:absolute before:w-1/2 before:animate-[spin_3s_linear_infinite] before:pb-[100%] before:opacity-0 hover:shadow-md  group-hover:before:opacity-100'>
                <div className='relative w-full'>
                  <div className='to-slate-100 z-10 block flex w-full justify-center gap-8 rounded-8 bg-gradient-to-r from-[#e2e8f0]  px-8 py-[6px] transition-opacity duration-500 ease-in-out group-hover:opacity-0'>
                    <Image
                      src={RoomTour}
                      width={20}
                      height={20}
                      alt='공간 투어 이미지'
                    />
                    3D 공간 투어
                  </div>

                  <span
                    className="z-10 before:bg-from-[#000000] absolute inset-0 inline-flex w-full items-center overflow-hidden whitespace-nowrap rounded-8 bg-white px-[100px] opacity-0 transition-opacity before:bg-gradient-to-r before:from-[#000000] before:to-[#000000] before:bg-clip-text before:px-[2px] before:text-transparent before:content-['3D_공간투어_바로가기'] after:bg-gradient-to-r after:from-[#6366f1] after:to-[#a5b4fc] after:bg-clip-text after:px-[2px]  group-hover:opacity-100"
                    aria-hidden='true'
                  />
                </div>
              </div>
            </a>
          </div>
        </section>
      </div>

      {isShareVisible && (
        <div className='absolute -bottom-80 flex h-88 w-160 items-center justify-center gap-20 rounded-8 border border-[rgba(0,0,0,0.06)] bg-white p-12 pb-8 shadow-lg md:-top-76'>
          <button
            onClick={handleShareWithKakao}
            className='flex flex-col items-center gap-4 text-12 text-gray-300'
          >
            <div className='flex h-36 w-36 items-center justify-center rounded-8 bg-[#FEE500]'>
              <IconKakaoLogo />
            </div>
            카카오톡
          </button>
          <button
            onClick={handleCopyLink}
            className='flex flex-col items-center gap-4 text-12 text-gray-300'
          >
            <div className='flex h-36 w-36 items-center justify-center rounded-8 border border-gray-200 bg-gray-100'>
              <IconLink />
            </div>
            링크 복사
          </button>
        </div>
      )}
    </div>
  );
};

export default ContactBox;
