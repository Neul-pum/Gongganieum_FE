import { useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { NextRouter } from 'next/router';
import toast from 'react-hot-toast';

const useHandleServerReq = ({ router }: { router: NextRouter }) => {
  const queryClient = useQueryClient();

  const handleServerReq = async ({
    reqFunc,
    toastMsg,
    toastErrorMsg,
    queryKey,
  }: {
    reqFunc: () => Promise<AxiosResponse<any, any>>;
    toastMsg: string;
    toastErrorMsg?: string;
    queryKey: string[];
  }) => {
    let alertMsg = '';
    try {
      const response = await reqFunc();

      if (response.status !== 200) throw new Error();

      // Toast message
      toast.success(toastMsg);
      queryClient.invalidateQueries({ queryKey });

      alertMsg =
        '변경 사항이 성공적으로 반영되었습니다. 페이지를 새로고침 합니다.';
    } catch {
      toast.error(toastErrorMsg ?? '서버 오류가 발생하였습니다!');

      alertMsg =
        '서버 오류로 인해 페이지를 새로고침 합니다. 처음부터 다시 작성해주세요.';
    }

    setTimeout(() => {
      const pageReloadConfirmed = confirm(alertMsg);
      if (pageReloadConfirmed) router.reload();
    }, 1500);
  };

  return { handleServerReq };
};

export default useHandleServerReq;
