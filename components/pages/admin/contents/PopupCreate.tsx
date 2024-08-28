import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import useHandleServerReq from 'hooks/useHandleServerReq';
import { postNewPopupData } from 'apis/admin';
import { getAllBuildingInfos } from 'apis/api';
import { PopupType } from 'types/client.types';
import RequiredStar from 'components/commons/RequiredStar';
import { IconArrowDown } from 'public/icons';
import TextInput from '../TextInput';

export type postPopupType = {
  keyword: string;
  buildingId: number;
} & PopupType;

interface BuildingIDAddressDictType {
  id: number;
  address: string;
}

const PostAndEditPopup = () => {
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<postPopupType>();

  const router = useRouter();

  const { handleServerReq } = useHandleServerReq({ router });

  const [buildingIDAddressDict, setBuildingIDAddressDict] =
    useState<BuildingIDAddressDictType[]>();
  const [selectedBuilding, setSelectedBuilding] =
    useState<BuildingIDAddressDictType>({
      id: 0,
      address: '',
    });
  const [query, setQuery] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  const filteredBuildingList =
    query === ''
      ? buildingIDAddressDict
      : buildingIDAddressDict?.filter((building) => {
          return building.address.toLowerCase().includes(query.toLowerCase());
        });

  const { data: buildingInfos } = useQuery({
    queryKey: ['buildings'],
    queryFn: getAllBuildingInfos,
  });

  const handleFormSubmit: SubmitHandler<postPopupType> = async (data) => {
    if (!isFormValid) return;
    const newPopupData = { ...data, buildingId: selectedBuilding.id };

    handleServerReq({
      reqFunc: () => postNewPopupData(newPopupData),
      toastMsg: '성공적으로 팝업 정보를 등록하였습니다!',
      queryKey: ['buildings'],
    });
  };

  const validateForm = () => {
    if (!isValid || !selectedBuilding.id) {
      toast.error('필수 입력 필드 값을 모두 입력해주세요!');
      setIsFormValid(false);
      return;
    }
    setIsFormValid(true);
  };

  useEffect(() => {
    const BuildingIDAddressDictTemp = buildingInfos?.map((buildingInfo) => ({
      id: buildingInfo._id,
      address: buildingInfo.address,
    }));

    setBuildingIDAddressDict(BuildingIDAddressDictTemp);
  }, [buildingInfos]);

  return (
    <div>
      <form
        className='flex w-600 flex-col'
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <div className='flex flex-col gap-28'>
          <div className='flex items-center justify-between'>
            <div className='flex'>
              <h3 className='mr-4 text-20 font-600'>해당 건물 주소</h3>
              <RequiredStar></RequiredStar>
            </div>
            <Combobox
              value={selectedBuilding}
              onChange={(value) => {
                setSelectedBuilding(value ?? { id: 0, address: '' });
              }}
            >
              <div className='relative'>
                <ComboboxInput
                  className={
                    'w-400 rounded-full border-[2px] border-[#6b6b6b] px-20 py-12 placeholder-gray-300'
                  }
                  placeholder='팝업 정보를 추가할 건물 주소 검색'
                  style={{ borderRadius: 20 }}
                  aria-label='SearchInput'
                  displayValue={(Building: BuildingIDAddressDictType) =>
                    Building?.address
                  }
                  onChange={(event) => setQuery(event.target.value)}
                />
                <ComboboxButton className='group absolute inset-y-0 right-0'>
                  <IconArrowDown className='size-4 fill-white/60 group-data-[hover]:fill-white' />
                </ComboboxButton>
              </div>
              <ComboboxOptions
                anchor='bottom'
                transition
                className={
                  'rounded-xl p-1 w-[var(--input-width)] border border-white/5 bg-white/5 empty:invisible'
                }
              >
                {filteredBuildingList?.map((Building) => (
                  <ComboboxOption
                    key={Building.id}
                    value={Building}
                    className='gap-2 rounded-lg group flex cursor-default select-none items-center border-b-[1px] border-black bg-white px-8 py-4'
                  >
                    <div className='text-sm/6'>{Building.address}</div>
                  </ComboboxOption>
                ))}
              </ComboboxOptions>
            </Combobox>
          </div>
          <TextInput
            register={{ ...register('name', { required: true }) }}
            label='팝업 이름'
            isRequired
          />
          <TextInput
            register={{ ...register('date', { required: true }) }}
            label='팝업 진행 날짜'
            isRequired
          />
          <TextInput
            register={{ ...register('keyword', { required: true }) }}
            label='팝업 관련 키워드'
            isRequired
          />
          <div className='flex w-full justify-between'>
            <div className='flex gap-4'>
              <h3 className='text-20 font-600'>관련 카테고리</h3>
              <RequiredStar />
            </div>
            <select
              {...register('type', { required: true })}
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

          <button
            title='건물 저장'
            type='submit'
            className='flex h-44 w-full cursor-pointer items-center justify-center rounded-12 bg-black px-[15px] py-[12px] text-center text-18 font-500 text-white'
            onClick={validateForm}
          >
            해당 건물에 팝업 정보 저장하기
          </button>
        </div>
      </form>
    </div>
  );
};
export default PostAndEditPopup;
