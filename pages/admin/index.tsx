import { useRouter } from 'next/router';
import { FormEvent, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import toast from 'react-hot-toast';
import { authorizeAdmin } from 'apis/admin';
import MetaTag from 'components/commons/MetaTag';

const Admin = () => {
  const [pwd, setPwd] = useState('');
  const [cookie, setCookie] = useCookies(['admin_access']);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

  const ADMIN_CONTENTS = [
    '건물 목록 조회',
    '새로운 건물 추가',
    '건물에 새 팝업 정보 추가',
    '유저 목록 조회',
    '캐러셀(배너) 목록 조회',
    '새로운 캐러셀(배너) 정보 추가',
    '문의하기 목록 조회',
    '[준비중]',
  ];

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (await isAdminLoginSuccess(pwd)) {
      toast.success('관리자로 로그인 되었습니다!');
      const expiration = new Date(Date.now() + 3600 * 1000); // 1시간
      setCookie('admin_access', true, {
        secure: false,
        sameSite: 'lax',
        path: '/',
        expires: expiration,
      });
      setIsAuthorized(true);
    }
  };

  const isAdminLoginSuccess = async (pwd: string) => {
    const authorizeStatus = await authorizeAdmin({ pwd, user: 'admin' });
    switch (authorizeStatus) {
      case 200:
        return true;
      case 409:
        toast.error(
          'DB에서 정보를 불러오는 데 오류가 발생하였습니다.\n다시 시도해주세요.',
        );
        return false;
      case 400:
        toast.error('비밀번호가 잘못되었습니다!');
        return false;
      default:
        toast.error('문제가 발생하였습니다. 관리자에게 문의하세요.');
        return false;
    }
  };

  useEffect(() => {
    // Hydration Error 방지 위해 CSR에서 관리자 로그인 여부 쿠키 정보 체크
    if (cookie.admin_access) setIsAuthorized(true);
  }, []);

  return (
    <>
      <MetaTag title='공간이음 | 관리자' />
      <div
        className={`flex h-[700px] w-full items-center justify-center ${isAuthorized ? 'bg-[#f1f1f1]' : 'bg-white'}`}
      >
        {isAuthorized ? (
          <div className='grid grid-cols-4 grid-rows-2 gap-40'>
            {ADMIN_CONTENTS.map((el, idx) => (
              <ContentRouteBtn key={idx} content={el} />
            ))}
          </div>
        ) : (
          <div className='mx-auto my-40 flex min-h-[60dvh] max-w-1000 items-center gap-20 '>
            <form
              onSubmit={(e) => handleLogin(e)}
              className='flex items-center gap-20'
            >
              <input
                type='password'
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                placeholder='Enter password'
                className='h-80 w-full border-gray-200 text-[36px] font-700 placeholder:opacity-20 focus:border-gray-300 focus:outline-none'
              />
              <button
                type='submit'
                className='h-full whitespace-nowrap rounded-10 bg-black px-16 py-12 text-14 font-600 text-white'
              >
                Submit
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

const ContentRouteBtn = (props: { content: string }) => {
  const { content } = props;

  const router = useRouter();
  return (
    <div
      className='flex h-[200px] w-[300px] cursor-pointer flex-col items-center justify-center gap-[10px] rounded-12 bg-white shadow-lg md:h-[300px] md:w-[500px] md:gap-[15px]'
      onClick={() => router.push(`/admin/${content}`)}
    >
      <h2 className='text-24 font-700'>{content}</h2>
      <h2 className='text-24 font-400 text-[#6e6e6e]'>바로가기</h2>
    </div>
  );
};
export default Admin;
