import { useQuery } from '@tanstack/react-query';
import { EMPTY_LIST_URL } from 'constants/common';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useSession from 'hooks/useSession';
import { getAllBuildingInfos, getLikeBuildingIds, getMyInfo } from 'apis/api';
import { BuildingType, UserDataType } from 'types/client.types';
import MetaTag from 'components/commons/MetaTag';
import PortalModal from 'components/commons/PortalModal';
import ProfileEditModal from 'components/commons/modals/ProfileEditModal';
import ContactTab from 'components/pages/mypage/ContactTab';
import LikeBuildingTab from 'components/pages/mypage/LikeBuildingTab';
import MypageProfile from 'components/pages/mypage/MypageProfile';

type TabType = 'like' | 'contact';

const Mypage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();
  const { getSession } = useSession();
  const session = getSession();

  const { data: userInfo }: { data?: UserDataType } = useQuery({
    queryKey: ['user', 'userInfo'],
    queryFn: () => getMyInfo(),
  });

  const { data: likeBuildingIds }: { data?: number[] } = useQuery({
    queryKey: ['user', 'likeBuildingIds'],
    queryFn: () => getLikeBuildingIds(),
  });

  const { data: buildings }: { data?: BuildingType[] } = useQuery({
    queryKey: ['buildings'],
    queryFn: () => getAllBuildingInfos(),
  });

  const likeBuildings = buildings?.filter((el) => {
    return likeBuildingIds?.includes(el._id);
  });

  const handleClickEditButton = () => setIsModalOpen(!isModalOpen);

  useEffect(() => {
    if (!session) {
      router.push('/login?isRedirected=true');
    }
  }, []);

  const [tab, setTab] = useState<TabType>('like');

  return (
    <>
      <MetaTag title='공간이음 | 마이페이지' />
      <div className='mx-auto my-76 flex max-w-1232 flex-col items-center md:my-56'>
        <MypageProfile
          profileImage={userInfo?.img ?? 'null'}
          nickname={userInfo?.nickname}
          email={userInfo?.email}
          description={userInfo?.description}
          onClick={handleClickEditButton}
        />
        {/* 찜하기 카드 리스트 */}
        <div className='flex w-full flex-col gap-24 px-16 md:my-28'>
          <div className='flex gap-32'>
            <button
              onClick={() => setTab('like')}
              className={`mb-24 text-32 font-800 md:text-28 ${tab === 'like' ? 'text-black' : 'text-gray-300/50'}`}
            >
              내 찜 목록
            </button>
            <button
              onClick={() => setTab('contact')}
              className={`mb-24 text-32 font-800 md:text-28 ${tab === 'contact' ? 'text-black' : 'text-gray-300/50'}`}
            >
              문의 내역
            </button>
          </div>
          {tab === 'like' ? (
            <LikeBuildingTab likeBuildings={likeBuildings} />
          ) : (
            <ContactTab />
          )}
        </div>
        <PortalModal openStatus={isModalOpen}>
          <ProfileEditModal
            setIsModalOpen={setIsModalOpen}
            userInfo={userInfo}
          />
        </PortalModal>
      </div>
    </>
  );
};
export default Mypage;
