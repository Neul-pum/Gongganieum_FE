import { useRouter } from 'next/router';
import MetaTag from 'components/commons/MetaTag';
import PostAndEditBuilding from 'components/pages/admin/contents/BuildingCU';
import ShowAndDeleteBuilding from 'components/pages/admin/contents/BuildingRD';
import PostAndEditCarousel from 'components/pages/admin/contents/CarouselCU';
import ShowAndDeleteCarousels from 'components/pages/admin/contents/CarouselRD';
import ShowAndDeleteContacts from 'components/pages/admin/contents/ContactRD';
import PostAndEditPopup from 'components/pages/admin/contents/PopupCreate';
import ShowAndDeleteUsers from 'components/pages/admin/contents/UserRD';

const AdminRouteContent = () => {
  const router = useRouter();
  const { content } = router.query;

  const getAdminContent = () => {
    switch (content) {
      case '건물 목록 조회':
        return <ShowAndDeleteBuilding />;
      case '새로운 건물 추가':
      case '건물 정보 수정':
        return <PostAndEditBuilding />;
      case '건물에 새 팝업 정보 추가':
        return <PostAndEditPopup />;
      case '유저 목록 조회':
        return <ShowAndDeleteUsers />;
      case '캐러셀(배너) 목록 조회':
        return <ShowAndDeleteCarousels />;
      case '새로운 캐러셀(배너) 정보 추가':
      case '캐러셀 정보 수정':
        return <PostAndEditCarousel />;
      case '문의하기 목록 조회':
        return <ShowAndDeleteContacts />;
      default:
        return <div>문제가 발생했습니다! 처음부터 다시 시작해주세요.</div>;
    }
  };
  return (
    <>
      <MetaTag title='공간이음 | 관리자' />
      <div className='flex h-full w-full flex-col items-center py-60'>
        <div className='pb-60 text-32 font-700'>{content}</div>
        {getAdminContent()}
      </div>
    </>
  );
};
export default AdminRouteContent;
