import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Control, Controller, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import useHandleServerReq from 'hooks/useHandleServerReq';
import { editCarouselData, postNewCarouselData } from 'apis/admin';
import { getCarouselInfo } from 'apis/api';
import { CarouselType } from 'types/client.types';
import RequiredStar from 'components/commons/RequiredStar';
import TextInput from '../TextInput';

export type postCarouselType = Omit<CarouselType, 'content' | '_id'>;

const CAROUSEL_DROPDOWN_OPTIONS = {
  pageType: ['main', 'map'],
  carouselType: [
    'main_banner',
    'primary',
    'secondary',
    'recommend_banner',
    'NULL',
  ],
  contentType: ['Buildings', 'Magazines'],
};

function PostAndEditCarousel() {
  const router = useRouter();

  // 건물 정보 수정일때만 id param값 존재
  const { id } = router.query; // id params : 수정할 건물 id

  const [isPageTypeCarouselEdit] = useState(id !== undefined);

  const {
    register,
    handleSubmit,
    formState: { isValid },
    control,
    reset,
    getValues,
  } = useForm<postCarouselType>(
    isPageTypeCarouselEdit
      ? {
          defaultValues: async () => {
            const carouselToEdit = await getCarouselInfo(Number(id));

            return {
              pageType: await carouselToEdit.pageType,
              carouselType: await carouselToEdit.carouselType,
              contentType: await carouselToEdit.contentType,
              contentId: await carouselToEdit.contentId,
            };
          },
        }
      : {},
  );

  const { handleServerReq } = useHandleServerReq({ router });

  const handleFormSubmit: SubmitHandler<postCarouselType> = (data) => {
    if (!checkIsFormValid()) return;

    const reqFunc = isPageTypeCarouselEdit
      ? () =>
          editCarouselData({
            ...data,
            id: parseInt(id as string),
          })
      : () => postNewCarouselData(data);

    handleServerReq({
      reqFunc,
      toastMsg: '성공적으로 캐러셀 정보를 저장하였습니다!',
      queryKey: ['buildings'],
    });
  };

  const checkIsFormValid = () => {
    if (!isValid) {
      toast.error('필수 입력 필드 값을 모두 입력해주세요!');
      return false;
    }
    if (getValues('contentType') === 'Magazines') {
      toast.error('현재 매거진은 캐러셀에 추가할 수 없습니다.');
      return false;
    }

    return true;
  };

  useEffect(() => {
    if (!isPageTypeCarouselEdit) return;

    toast.loading('해당 캐러셀 정보를 불러오는 중입니다...');

    const getInitialCarouselInfo = async () => {
      const initialCarouselData = await getCarouselInfo(Number(id));

      if (initialCarouselData) {
        setTimeout(() => toast.remove(), 1000);
      }
    };

    getInitialCarouselInfo();
  }, []);

  return (
    <div>
      <form
        className='flex w-600 flex-col py-24'
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <div className='flex w-full flex-col gap-32'>
          <DropdownForm
            control={control}
            formRegisterName='pageType'
            isRequired
          />
          <DropdownForm control={control} formRegisterName='carouselType' />
          <DropdownForm
            control={control}
            formRegisterName='contentType'
            isRequired
          />
          <div>
            <TextInput
              register={{ ...register('contentId', { required: true }) }}
              label='contentId'
              isRequired
              type='number'
            />
            <h5 className='mt-4 text-right text-12'>
              * 숫자만 입력 가능합니다.
            </h5>
          </div>
          <button
            title='건물 저장'
            type='submit'
            className='flex h-44 w-full cursor-pointer items-center justify-center rounded-12 bg-black px-[15px] py-[12px] text-center text-18 font-500 text-white'
            onClick={checkIsFormValid}
          >
            {isPageTypeCarouselEdit
              ? '캐러셀 수정사항 저장하기'
              : '새로운 캐러셀 추가하기'}
          </button>
        </div>
      </form>
    </div>
  );
}

const DropdownForm = ({
  control,
  formRegisterName,
  isRequired = false,
}: {
  control: Control<postCarouselType, any>;
  formRegisterName: 'pageType' | 'carouselType' | 'contentType';
  isRequired?: boolean;
}) => {
  return (
    <Controller
      rules={{ required: isRequired }}
      control={control}
      name={formRegisterName}
      render={({ field: { onChange, value, ref } }) => (
        <div className='flex w-full items-center justify-between'>
          <div className='flex gap-4'>
            <h3 className='text-20 font-600'>{formRegisterName}</h3>
            {isRequired ? <RequiredStar /> : <></>}
          </div>
          <select
            title='카테고리 선택'
            onChange={onChange}
            value={value ?? ''}
            ref={ref}
            className='h-44 w-200 rounded-8 border-[2px] border-[#e7e7e7] px-8'
          >
            <option value=''>카테고리 선택</option>
            {CAROUSEL_DROPDOWN_OPTIONS[formRegisterName]?.map(
              (option: string) => (
                <option value={option} key={option}>
                  {option}
                </option>
              ),
            )}
          </select>
        </div>
      )}
    />
  );
};
export default PostAndEditCarousel;
