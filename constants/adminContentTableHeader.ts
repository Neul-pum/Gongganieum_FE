import { BuildingType, CategoryType, RoleType } from 'types/client.types';

export const BUILDING_LIST_HEADER = {
  _id: 0,
  name: '건물 이름',
  address: '주소',
  coord: '좌표',
  isours: false,
  tag: '관련 태그',
  cate: '기타' as CategoryType,
  img: '건물 이미지',
  popups: [],
  scanUrl: '3D스캔',
};

export const CONTACT_LIST_HEADER = {
  _id: 0,
  buildingId: 0,
  userId: 0,
  added_date: '문의 작성 날짜',
  name: '유저 이름',
  phone: '전화번호',
  email: '이메일',
  company: '회사명/단체명',
  date1: '일정',
  date2: '차순위 일정',
  budget: '예산',
  reason: '사용 목적',
  enterpath: '유입 경로',
  size: '희망 면적',
  areaList: '희망 지역',
  requests: '요청사항',
};

export const USER_LIST_HEADER = {
  _id: 0,
  name: '이름',
  role: 'USER' as RoleType,
  nickname: '닉네임',
  age: '나이',
  sex: '성별',
  email: '이메일',
  company: '회사명',
  brand: '주요 제품(서비스)',
  tag: '관심 분야',
  img: '사진',
  description: '설명',
  phone: '전화번호',
};

export const CAROUSEL_LIST_HEADER = {
  _id: 0,
  pageType: '페이지',
  carouselType: '캐러셀 종류',
  contentType: '캐러셀 컨텐츠 타입',
  contentId: 0,
  content: {} as BuildingType,
};
