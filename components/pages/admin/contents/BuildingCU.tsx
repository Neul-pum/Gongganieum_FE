import { ROOT_IMAGE_URL } from 'constants/common';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import useHandleServerReq from 'hooks/useHandleServerReq';
import { editBuildingData, postNewBuildingData } from 'apis/admin';
import { getBuildingInfo } from 'apis/api';
import { BuildingType } from 'types/client.types';
import RequiredStar from 'components/commons/RequiredStar';
import { IconCloseButton } from 'public/icons';
import ImageInput from '../ImgInput';
import TextInput from '../TextInput';

export type postBuildingType = Omit<
  BuildingType,
  '_id' | 'latest_end_date' | 'popups' | 'img'
>;
function PostAndEditBuilding() {
  const router = useRouter();

  // 건물 정보 수정일때만 id param값 존재
  const { id } = router.query; // id params : 수정할 건물 id

  const [isPageTypeBuildingEdit] = useState(id !== undefined);
  const [initialBuildingInfo, setInitialBuildingInfo] =
    useState<BuildingType>();
  const [imgData, setImgData] = useState<File[] | null>(null);
  const [popupJSONStrData, setPopupJSONStrData] = useState<string>('');
  const [editedImgList, setEditedImgList] = useState<string[]>();
  const [isPopupInfoOpen, setIsPopupInfoOpen] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { isValid },
    control,
    reset,
  } = useForm<postBuildingType>(
    isPageTypeBuildingEdit
      ? {
          defaultValues: async () => ({
            ...(await getBuildingInfo(Number(id))),
            isours: Boolean((await getBuildingInfo(Number(id))).isours),
          }),
        }
      : {},
  );

  const { handleServerReq } = useHandleServerReq({ router });

  const handleFormSubmit: SubmitHandler<postBuildingType> = (data) => {
    if (!checkIsFormValid()) return;

    let buildingInfoData: {} = data;

    if (isPageTypeBuildingEdit) {
      buildingInfoData = {
        ...data,
        coord: data.coord.replaceAll(' ', ''),
        tag: data?.tag ? data.tag.replaceAll(' ', '') : '',
        img: editedImgList?.join(','),
        popups: popupJSONStrData
          ? popupJSONStrData.replaceAll('},\n{', '},{')
          : '',
      };
    }

    const buildingFormData = new FormData();
    buildingFormData.append(
      'buildingFormData',
      JSON.stringify(buildingInfoData),
    );

    // 이미지 있는경우 이미지도 함께 업로드
    if (imgData) imgData?.map((el) => buildingFormData.append('file', el));
    const reqFunc = isPageTypeBuildingEdit
      ? () => editBuildingData(buildingFormData!)
      : () => postNewBuildingData(buildingFormData!);

    handleServerReq({
      reqFunc,
      toastMsg: '성공적으로 해당 건물 정보를 저장하였습니다!',
      queryKey: ['buildings'],
    });
  };

  const checkIsFormValid = () => {
    if (!isValid) {
      toast.error('필수 입력 필드 값을 모두 입력해주세요!');
      return false;
    }

    return true;
  };

  // save initial values
  useEffect(() => {
    setEditedImgList(
      initialBuildingInfo?.img ? initialBuildingInfo?.img?.split(',') : [],
    );
    // 팝업 정보 리스트 출력 할 때 팝업 구분을 위한 줄바꿈 추가
    setPopupJSONStrData(
      initialBuildingInfo?.popups
        ? JSON.stringify(initialBuildingInfo?.popups).replaceAll('},{', '},\n{')
        : '',
    );
  }, [initialBuildingInfo]);

  useEffect(() => {
    if (!isPageTypeBuildingEdit) return;

    toast.loading('해당 건물 정보를 불러오는 중입니다...');

    const getInitialBuildingInfo = async () => {
      const initialBuildingData = await getBuildingInfo(Number(id));
      setInitialBuildingInfo(initialBuildingData);
      if (initialBuildingData) {
        setTimeout(() => toast.remove(), 1500);
      }
    };

    getInitialBuildingInfo();
  }, []);

  return (
    <div>
      <form
        className='flex w-600 flex-col'
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <div className='flex flex-col gap-28'>
          <TextInput
            register={{ ...register('name', { required: true }) }}
            label='건물 이름'
            isRequired
          />
          <TextInput
            register={{ ...register('address', { required: true }) }}
            label='건물 주소'
            isRequired
          />
          <div>
            <TextInput
              register={{ ...register('coord', { required: true }) }}
              label='건물 좌표'
              isRequired
            />
            <WarningText className='mt-[5px] text-right'>
              <a
                className='font-600 underline'
                href={
                  'https://developers.google.com/maps/documentation/geocoding/overview?hl=ko'
                }
                target={'_blank'}
              >
                위 사이트(Google Maps Geocoding API)
              </a>
              에서 해당 건물 주소에 대한 좌표를 검색하고,
              <p />
              위도와 경도 순으로 띄어쓰기 없이 11,22 형태로 입력해주세요.
            </WarningText>
          </div>
          <TextInput
            register={{ ...register('scanUrl') }}
            label='3D 스캔 URL 주소'
          />
          <div>
            <TextInput
              register={{ ...register('tag') }}
              label='주요 팝업 이력 태그'
              placeholder='해당 건물의 주요 팝업 이력 입력 (ex: 젠틀몬스터,무신사,애플)'
            />
            <WarningText className='mt-[5px] text-right'>
              태그는 띄어쓰기 없이 쉼표(,)로 구분하여 입력해주세요. (ex: A,B,C)
            </WarningText>
          </div>
          <div className='flex w-full justify-between'>
            <div className='flex gap-4'>
              <h3 className='text-20 font-600'>직영 건물 여부</h3>
              <RequiredStar />
            </div>

            <Controller
              control={control}
              name={'isours'}
              render={({ field: { onChange, value, ref } }) => (
                <div className='flex items-center'>
                  <input
                    type='radio'
                    id='is_ours_true'
                    className='ml-20 mr-8 h-20 w-20'
                    onChange={() => onChange(true)}
                    checked={value === true}
                    ref={ref}
                  />
                  <label htmlFor='is_ours_true' className='text-16 font-600'>
                    예
                  </label>
                  <input
                    type='radio'
                    value={'false'}
                    id='is_ours_false'
                    className='ml-20 mr-8 h-20 w-20'
                    onChange={() => onChange(false)}
                    checked={value === false}
                    ref={ref}
                  />
                  <label htmlFor='is_ours_false' className='text-16 font-600'>
                    아니요
                  </label>
                </div>
              )}
            />
          </div>

          <div className='flex w-full items-center justify-between'>
            <div className='flex gap-4'>
              <h3 className='text-20 font-600'>카테고리</h3>
              <RequiredStar />
            </div>
            <select
              {...register('cate', { required: true })}
              className='h-44 w-200 rounded-8 border-[2px] border-[#e7e7e7] px-12'
            >
              <option value=''>카테고리 선택</option>
              <option value='패션'>패션</option>
              <option value='뷰티'>뷰티</option>
              <option value='F&B'>F&B</option>
              <option value='캐릭터'>캐릭터</option>
              <option value='미디어'>미디어</option>
              <option value='기타'>기타</option>
            </select>
          </div>

          {isPageTypeBuildingEdit ? (
            <div className='flex w-full flex-col'>
              <div className='flex items-center justify-between'>
                <h3 className='text-20 font-600'>팝업 정보 목록 조회</h3>
                <button
                  type='button'
                  onClick={() => setIsPopupInfoOpen((prev) => !prev)}
                  className='flex h-[38px] w-fit cursor-pointer items-center rounded-12 bg-[#545454] px-[15px] text-14 text-white'
                >
                  {`해당 건물의 팝업 정보 목록 ${isPopupInfoOpen ? '감추기' : '보이기'}`}
                </button>
              </div>

              {isPopupInfoOpen ? (
                <WarningText>
                  현재는 팝업 정보 조회만 가능합니다.
                  <textarea
                    placeholder='해당 건물에 팝업 데이터가 없습니다'
                    className='mt-12 h-[250px] w-full border-[1px] p-4 text-[14px] text-black'
                    value={popupJSONStrData}
                    // onChange={(e) => setPopupJSONStrData(e.target.value)}
                  />
                </WarningText>
              ) : (
                <></>
              )}
            </div>
          ) : (
            <></>
          )}

          <div>
            <div className='-mb-32 flex gap-4'>
              <h3 className='text-20 font-600'>
                {isPageTypeBuildingEdit
                  ? '기존 건물 이미지 목록'
                  : '건물 이미지'}
              </h3>
            </div>

            {/* 이미지 미리보기 */}
            {isPageTypeBuildingEdit ? (
              <div className='mt-44 flex w-full items-end gap-12'>
                {editedImgList?.map((imgName, currImgIdx) => (
                  <div
                    key={currImgIdx}
                    className='relative flex w-fit flex-col overflow-auto'
                  >
                    <Image
                      src={`${ROOT_IMAGE_URL}${imgName}`}
                      alt='건물 이미지'
                      width={120}
                      height={120}
                    />
                    <h5>{imgName}</h5>
                    <div
                      className='absolute right-[1px] top-[2px] cursor-pointer'
                      onClick={() => {
                        if (!confirm('정말 이 건물 사진을 지우시겠습니까?'))
                          return;
                        setEditedImgList((prevImgList) =>
                          prevImgList?.filter((_, idx) => idx !== currImgIdx),
                        );
                      }}
                    >
                      <IconCloseButton />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <></>
            )}
          </div>
          <div>
            {isPageTypeBuildingEdit ? (
              <h3 className='-mb-24 text-20 font-600'>
                건물 이미지 새로 추가하기
              </h3>
            ) : (
              <></>
            )}
            <WarningText
              className={`${isPageTypeBuildingEdit ? 'mb-8 mt-[25px]' : ''} `}
            >
              {' '}
              <a
                className='font-600 underline'
                href={'https://imagecompressr.com/'}
                target={'_blank'}
              >
                위 사이트(이미지 압축 사이트)
              </a>
              에서 300kb이하로 이미지 압축 후, 업로드해주세요.
            </WarningText>
            <ImageInput setImgFormData={setImgData} />
          </div>
          <button
            title='건물 저장'
            type='submit'
            className='flex h-44 w-full cursor-pointer items-center justify-center rounded-12 bg-black px-[15px] py-[12px] text-center text-18 font-500 text-white'
            // style={{
            //   cursor: isSubmitBtnDisabled ? 'not-allowed' : 'pointer',
            //   backgroundColor: isSubmitBtnDisabled ? '#696969' : 'black',
            // }}
            onClick={checkIsFormValid}
          >
            {isPageTypeBuildingEdit
              ? '건물 정보 수정사항 저장하기'
              : '새로운 건물 추가하기'}
          </button>
        </div>
      </form>
    </div>
  );
}

const WarningText = ({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className={`text-[12px] text-[#e63636] ${className}`}>{children}</div>
  );
};
export default PostAndEditBuilding;
