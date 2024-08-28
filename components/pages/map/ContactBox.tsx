import { BASE_URL } from 'constants/common';
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
  IconRedLike,
  IconShare,
} from 'public/icons';

const ContactBox = (props: { id: number; initialIsLiked: boolean }) => {
  const { id, initialIsLiked } = props;

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
      imageUrl: '/icons/logo.svg',
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
      className='relative mt-20 flex h-44 w-full shrink-0 items-center gap-8 bg-white'
    >
      <button
        onClick={handleLike}
        className='flex h-44 w-44 shrink-0 items-center justify-center rounded-full border border-[rgba(0,0,0,0.2)]'
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
        className='flex h-full w-full items-center justify-center rounded-8 bg-black text-16 font-700 text-white'
      >
        문의하기
      </Link>
      {isShareVisible && (
        <div className='absolute bottom-52 flex h-88 w-160 items-center justify-center gap-20 rounded-8 border border-[rgba(0,0,0,0.06)] bg-white p-12 pb-8 shadow-lg'>
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
