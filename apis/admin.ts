import { postCarouselType } from 'components/pages/admin/contents/CarouselCU';
import { postPopupType } from 'components/pages/admin/contents/PopupCreate';
import { instance } from './config/default';

// DATA SAVE API
// 새 빌딩 정보 추가
export const postNewBuildingData = async (newBuildingFormData: FormData) => {
  const res = await instance.post('/admin/save/building', newBuildingFormData);
  return res;
};

// 새 팝업 정보 추가
export const postNewPopupData = async (newPopupData: postPopupType) => {
  const res = await instance.post('/admin/save/popup', newPopupData);
  return res;
};

// 캐러셀 정보 추가
export const postNewCarouselData = async (
  newCarouselData: postCarouselType,
) => {
  const res = await instance.post(`/admin/save/carousel`, newCarouselData);
  return res;
};

// DATA EDIT API
// 기존 건물 정보 수정
export const editBuildingData = async (buildingFormData: FormData) => {
  const res = await instance.post('/admin/edit/building', buildingFormData);
  return res;
};

// 기존 캐러셀 컨텐츠 정보 수정
export const editCarouselData = async (
  carouselData: postCarouselType & { id: number },
) => {
  const res = await instance.put(`/admin/edit/carousel`, carouselData);
  return res;
};

// DATA DELETE API
// 빌딩 정보 삭제
export const deleteBuildingData = async (id: number) => {
  const res = await instance.delete(`/admin/delete/building?id=${id}`);
  return res;
};

// 케러셀 정보 삭제
export const deleteCarouselData = async (id: number) => {
  const res = await instance.delete(`/admin/delete/carousel?id=${id}`);
  return res;
};

// 문의하기 정보 삭제
export const deleteContactData = async (id: number) => {
  const res = await instance.delete(`/admin/delete/contact?id=${id}`);
  return res;
};

// 유저 정보 삭제
export const deleteUserData = async (id: number) => {
  const res = await instance.delete(`/admin/delete/user?id=${id}`);
  return res;
};

// ADMIN AUTHORIZATION API
// 관리자 비밀번호 검증
export const authorizeAdmin = async ({
  pwd,
  user,
}: {
  pwd: string;
  user: string;
}) => {
  try {
    const res = await instance.post('/admin/authorize', { pwd, user });
    return res.status;
  } catch (e: any) {
    return e.response.status;
  }
};
