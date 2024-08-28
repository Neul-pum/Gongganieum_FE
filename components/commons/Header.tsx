import { AxiosError } from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';
import useSession from 'hooks/useSession';
import { requestUserRole } from 'apis/auth';
import { ERROR_TYPE, RoleType } from 'types/client.types';
import {
  IconHamburgerMenu,
  IconLogo,
  IconSearch,
  IconSmallLogo,
} from 'public/icons';
import PortalModal from './PortalModal';
import SearchInput from './SearchInput';
import ProfileModal from './modals/ProfileModal';
import TermsModal from './modals/TermsModal';
import WelcomeModal from './modals/WelcomeModal';

const DEFAULT_QUERY =
  '?as=지역명&q=&order=&cate=전체&isours=false&iscurrent=false&isliked=false&page=';

const Header = () => {
  const { getSession, removeSession } = useSession();

  const session = getSession();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const newSession = getSession();
    setIsLoggedIn(newSession);
  }, [session]);

  const TAB_INFOS = [
    { name: '홈', path: '/', href: '/' },
    {
      name: '지도',
      path: '/map',
      href: '/map' + DEFAULT_QUERY,
    },
    {
      name: '리스트',
      path: '/list',
      href: '/list' + DEFAULT_QUERY + '1',
    },
    { name: '매거진', path: '/magazine', href: '/magazine' },
    {
      name: '마이페이지',
      path: '/mypage',
      href: isLoggedIn ? '/mypage' : '/login?isRedirected=true',
    },
  ];

  const handleLogout = () => {
    removeSession({ redirectUri: '/' });
    setIsSignUpModalOpen(false);
  };

  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [signUpStatus, setSignUpStatus] = useState(0);

  const onNextClick = () => {
    setSignUpStatus((prev) => prev + 1);
  };

  const reqUserRole = async () => {
    try {
      const roleRes: RoleType = await requestUserRole();
      const isSignUpNeeded = roleRes === 'GUEST';
      setIsSignUpModalOpen(isSignUpNeeded);
    } catch (error) {
      const knownError = error as AxiosError<{ error: ERROR_TYPE }>;
      const errorMessage = knownError.response?.data.error;
      if (errorMessage === 'USER_SESSION_EXPIRED') {
        removeSession({
          redirectUri: '/',
          toastMessage: '세션이 만료되었습니다. 다시 로그인해주세요.',
          toastType: 'error',
        });
      } else {
        removeSession({
          redirectUri: '/',
          toastMessage: '에러가 발생했습니다. 다시 로그인해주세요.',
          toastType: 'error',
        });
      }
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      reqUserRole();
    }
  }, [isLoggedIn]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <div>
        {/* Hamburger Menu Content */}
        {isMenuOpen && (
          <>
            <div className='fixed top-64 z-[4] hidden w-full animate-slideDown flex-col items-start gap-32 bg-white p-20 md:flex'>
              {TAB_INFOS.map((el) => (
                <Link
                  key={el.name}
                  href={el.href}
                  onClick={() => setIsMenuOpen(false)}
                  className='text-gray-700 flex h-24 w-full items-center justify-center gap-12 text-16 font-500'
                >
                  {el.name}
                </Link>
              ))}
            </div>
            <div
              onClick={() => setIsMenuOpen(false)}
              className='fixed bottom-0 left-0 z-[3] flex h-screen w-full items-end justify-center bg-[#32363e] bg-opacity-70'
            />
          </>
        )}
        {/* Content */}
        <header className='sticky top-0 z-nav h-72 w-full border-b border-[#000]/5 bg-white md:z-popup md:h-64'>
          <div className='m-auto flex h-full max-w-1224 items-center justify-between px-16'>
            <Link href='/' className='md:hidden'>
              <IconLogo />
            </Link>
            <Link href='/' className='hidden md:block'>
              <IconSmallLogo />
            </Link>
            <div className='flex h-full gap-52 md:hidden'>
              {TAB_INFOS.map((tab) => (
                <TabButton key={tab.name} path={tab.path} href={tab.href}>
                  {tab.name}
                </TabButton>
              ))}
            </div>
            <div className='flex items-center gap-12'>
              <div className='md:hidden'>
                <SearchBar />
              </div>
              <button
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className='hidden h-28 w-28 md:inline'
              >
                <IconHamburgerMenu />
              </button>
              <Link
                href={'/list' + DEFAULT_QUERY + '1'}
                className='hidden md:inline'
              >
                <IconSearch />
              </Link>
              {isLoggedIn ? (
                <div
                  className='flex h-40 w-68 shrink-0 items-center justify-center rounded-8 border border-black bg-white text-14 font-600 text-black hover:bg-black hover:text-white'
                  onClick={handleLogout}
                >
                  로그아웃
                </div>
              ) : (
                <div>
                  <Link
                    href='/login'
                    className='flex h-40 w-68 shrink-0 items-center justify-center rounded-8 bg-black text-14 font-600 text-white'
                  >
                    로그인
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>
      </div>
      <PortalModal openStatus={isSignUpModalOpen}>
        {signUpStatus === 0 ? (
          <WelcomeModal
            handleNextClick={onNextClick}
            handleLogout={handleLogout}
          />
        ) : signUpStatus === 1 ? (
          <TermsModal handleNextClick={onNextClick} />
        ) : (
          <ProfileModal setIsModalOpen={setIsSignUpModalOpen} />
        )}
      </PortalModal>
    </>
  );
};

export default Header;

const TabButton = (props: {
  children: ReactNode;
  path: string;
  href: string;
}) => {
  const { children, path, href } = props;
  const router = useRouter();
  const currPath = router.pathname;

  return (
    <Link
      href={href}
      className={`flex h-full w-80 items-center justify-center text-16 font-600 ${currPath === path ? 'border-b-2 border-black' : ''}`}
    >
      {children}
    </Link>
  );
};

const SearchBar = () => {
  const [value, setValue] = useState('');
  const router = useRouter();

  const handleSubmit = (value: string) => {
    router.push(
      `/list?as=지역명&q=${value}&order=&cate=전체&isours=false&iscurrent=false&isliked=false&page=1`,
    );
  };

  return (
    <div className='w-240 md:w-full'>
      <SearchInput
        value={value}
        setValue={setValue}
        placeholder='지역명을 입력해보세요.'
        onSubmit={handleSubmit}
        size='sm'
      />
    </div>
  );
};
