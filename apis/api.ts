import {
  AsType,
  BuildingType,
  CarouselType,
  CategoryType,
  ContactType,
  MagazineType,
  OrderType,
  UserContactType,
  UserDataType,
} from 'types/client.types';
import { PAGE_LIMIT } from 'components/pages/list/PageButton';
import { instance } from './config/default';

// 건물 전체 조회
export const getAllBuildingInfos = async () => {
  const res = await instance.get('/building/infos');
  return res.data as BuildingType[];
};

// 건물 리스트 조회 및 지도 검색창
export const getFilteredBuildings = async (params: {
  q?: string;
  order?: OrderType;
  cate?: CategoryType | '전체';
  as?: AsType;
  isours?: boolean;
  iscurrent?: boolean;
  page?: string;
}) => {
  const { q, order, cate, as, isours, iscurrent, page } = params;
  const parsedAs =
    as === '빌딩명' ? 'building' : as === '팝업명' ? 'popup' : 'address';

  const res = await instance.get(`/building/search?`, {
    params: {
      q,
      order,
      cate,
      as: parsedAs,
      isours,
      is_current: iscurrent,
      page: page ? Number(page) : undefined,
      limit: PAGE_LIMIT,
    },
  });

  return res.data as { result: BuildingType[]; count?: number };
};

// 특정 건물 조회
export const getBuildingInfo = async (id: number) => {
  const res = await instance.get('/building/infos', { params: { id } });
  return res.data[0] as BuildingType;
};

// 찜하기
export const postLikeToggle = async (buildingId: number) => {
  await instance.post(`/user/building/likes`, {
    buildingId,
  });
};

// 찜한 건물 조회
export const getLikeBuildingIds = async () => {
  const res = await instance.get(`/user/building/likes`);
  return res.data?.buildingIdList as number[] | null;
};

// 유저 본인 정보 조회
export const getMyInfo = async () => {
  try {
    const res = await instance.get(`/user/info`);
    return res.data as UserDataType;
  } catch (error) {
    console.error('Error fetching user info:', error);
    throw error;
  }
};

// 전체 유저 목록 조회
export const getAllUserInfo = async () => {
  const res = await instance.get('/user/infos');
  return res.data;
};

// 특정 유저 정보 조회
export const getUserInfo = async (userId: number) => {
  const res = await instance.get(`/user/info?id=${userId}`);
  return res.data as UserDataType;
};

// 전체 문의하기 목록 조회
export const getAllBuildingContactInfo = async () => {
  const res = await instance.get('/contact/infos');
  return res.data;
};

// 문의하기
export const postBuildingContact = async (data: ContactType) => {
  const res = await instance.post('/contact', data);
  return res.data;
};

// 유저별 문의하기 조회
export const getUserContact = async () => {
  const res = await instance.get('/contact/info');
  return res.data as UserContactType[];
};

// 문의하기 삭제
export const removeUserContact = async (id: number) => {
  const res = await instance.get(`/contact/remove?id=${id}`);
  return res.data;
};

// 전체 케러셀 목록 조회
export const getAllCarouselInfo = async () => {
  const res = await instance.get('/carousel/infos');
  return res.data;
};

// 특정 케러셀 정보 조회
export const getCarouselInfo = async (id: number) => {
  const res = await instance.get(`/carousel/infos?id=${id}`);
  return res.data[0];
};

// 홈페이지 캐러셀 이미지 조회 (타입: 메인, 프라이머리, 세컨더리, 추천)
export const getHomeCarousel = async (
  type: 'main_banner' | 'primary' | 'secondary' | 'recommend_banner',
) => {
  const res = await instance.get(`/carousel/building/main?type=${type}`);
  return res.data as CarouselType[];
};

// 지도 페이지 추천 건물
export const getRecommendedBuildings = async () => {
  const res = await instance.get('/carousel/building/map');
  return res.data as CarouselType[];
};

// 에디터 이미지 등록
export const postEditorImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await instance.post('/magazine/upload_image', formData);

  return res.data.image_url as string;
};

// 매거진 전제 조회
export const getAllMagazines = async () => {
  const res = await instance.get('/magazine/infos');
  return res.data;
};

// 특정 매거진 본문 조회
export const getMagazineContent = async (id: number) => {
  const res = await instance.get(`/magazine/contentHTML?id=${id}`);
  return res.data[0].contentHTML as string;
};

// 매거진 게시
export const postMagazine = async (data: Omit<MagazineType, '_id'>) => {
  const parsedContentHTML = data.contentHTML
    .replaceAll('img', 'img style="width: 100%"')
    .replaceAll('"', '""');
  const parsedData = {
    ...data,
    contentHTML: parsedContentHTML,
  };
  const res = await instance.post(`/magazine`, parsedData);
  return res.status;
};
