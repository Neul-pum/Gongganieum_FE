export interface PopupType {
  name: string;
  date: string;
  type: string;
}

export interface BuildingType {
  _id: number;
  name: string;
  address: string;
  coord: string;
  popups: PopupType[];
  tag?: string;
  cate: CategoryType;
  isours?: boolean;
  latest_end_date: Date;
  img: string | null;

  scanUrl: string; // 3D 스캔 URL
}

export type CategoryType =
  | '패션'
  | '뷰티'
  | 'F&B'
  | '캐릭터'
  | '미디어'
  | '기타';

export interface PopulationType {
  areaName: string;
  updateTime: string;
  areaState: string;
  areaCongestionMessage: string;
  maleRate: string;
  femaleRate: string;
  ageTeenager: string;
  ageTwenties: string;
  ageThirties: string;
  ageForties: string;
  ageFifties: string;
  ageSixties: string;
  residentRate: string;
  noneResidentRate: string;
}

export type PopulationKeysType = keyof PopulationType;

export type AsType = '지역명' | '빌딩명' | '팝업명';

export type OrderType = 'new' | 'popular' | 'likes';

export interface BuildingDataType {
  연면적: number | null;
  용적률: number | null;
  건폐율: number | null;
  사용승인일: string | null;
  승강기: number | null;
  지상층수: number | null;
  지하층수: number | null;
  주용도: string | null;
  주차대수: number | null;
}

export type PageType = 'map' | 'description';

export type RoleType = 'GUEST' | 'USER' | 'SIGNED_OUT';

export interface UserDataType {
  _id: number;
  name: string;
  email: string;
  nickname: string;
  img: string;
  description: string;
  brand: string;
  company: string;
  tag: string;
  role: RoleType;
  age: string;
  phone: string;
  sex: string;
}
export interface ContactType {
  _id?: number;
  buildingId: number;
  name: string;
  userId?: number;
  phone: string;
  email: string;
  company?: string;
  date1: string;
  date2?: string;
  budget: string;
  reason: string;
  enterpath?: string;
  size?: string;
  areaList?: string;
  requests?: string;
  addedDate?: string;
}

export interface UserContactType extends ContactType {
  addedDate: string;
  _id: number;
  userId: number;
}

export interface CarouselType {
  _id: number;
  pageType: string;
  carouselType: string;
  contentType: string;
  contentId: number;
  content: BuildingType;
}

export type ERROR_TYPE = 'USER_SIGNED_OUT' | 'USER_SESSION_EXPIRED';

export interface MagazineType {
  _id: number;
  title: string;
  cate: string;
  date: string;
  img?: string;
  writer: string;
  contentHTML: string;
}

export interface MagazineDetailType {
  id: number;
  magazineId: number;
  contentHTML: string;
}

export interface StringObj {
  [key: string]: string;
}
