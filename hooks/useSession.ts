import { useRouter } from 'next/router';
import { useCookies } from 'react-cookie';
import toast from 'react-hot-toast';
import { RoleType } from 'types/client.types';

export interface SessionType {
  accessToken: string;
  name: string;
  role: RoleType;
}

const LOGIN_TIME = 3600 * 1000 * 3; // 3시간

const useSession = () => {
  const [cookie, setCookie, removeCookie] = useCookies([
    'session',
    'access_token',
  ]);
  const router = useRouter();

  const setSession = (data: SessionType, redirectUri?: string) => {
    const expiration = new Date(Date.now() + LOGIN_TIME);

    setCookie('access_token', data.accessToken, {
      secure: false,
      sameSite: 'lax',
      path: '/',
      expires: expiration,
    });
    setCookie('session', JSON.stringify(data), {
      secure: false,
      sameSite: 'lax',
      path: '/',
      expires: expiration,
    });

    redirectUri && router.push(redirectUri); // routePath로 리다이렉트
  };

  const removeSession = (redirectUri: string) => {
    removeCookie('access_token', { path: '/' });
    removeCookie('session', { path: '/' });
    toast.success('로그아웃 되었습니다!');
    router.push(redirectUri);
  };

  const getSession = () => {
    const session: SessionType = cookie.session;
    if (!session) {
      return false;
    }
    return session;
  };

  return { setSession, removeSession, getSession };
};

export default useSession;
