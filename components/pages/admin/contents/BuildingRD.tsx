import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react';
import { useQuery } from '@tanstack/react-query';
import { BUILDING_LIST_HEADER } from 'constants/adminContentTableHeader';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import useHandleServerReq from 'hooks/useHandleServerReq';
import { deleteBuildingData } from 'apis/admin';
import { getAllBuildingInfos } from 'apis/api';
import { BuildingType, PopupType } from 'types/client.types';
import { IconClose, IconEditPencil } from 'public/icons';

export type showBuildingType = Omit<BuildingType, 'latest_end_date'>;

const ShowAndDeleteBuilding = () => {
  const { data: allBuildingInfos } = useQuery({
    queryKey: ['buildings'],
    queryFn: getAllBuildingInfos,
  });

  const [selectedBuilding, setSelectedBuilding] = useState<showBuildingType>();
  const [query, setQuery] = useState('');

  const filteredBuildingList =
    query === ''
      ? allBuildingInfos
      : allBuildingInfos?.filter((buildingInfo: showBuildingType) => {
          return buildingInfo.name.toLowerCase().includes(query.toLowerCase());
        });

  useEffect(() => {
    !allBuildingInfos && toast.loading('해당 건물 정보를 불러오는 중입니다...');

    if (allBuildingInfos && toast) {
      setTimeout(() => toast.remove(), 1500);
    }
  }, [allBuildingInfos]);

  return (
    <div className='-mt-12 h-680 w-1440 rounded-8 bg-[#f1f1f1] p-20'>
      <h3 className='mb-12 ml-8 mt-4 text-20 font-700'>건물 검색</h3>
      <Combobox
        value={selectedBuilding}
        onChange={(value) => {
          if (value?._id) setSelectedBuilding(value!);
        }}
      >
        <ComboboxInput
          className={'mb-20 w-full rounded-16 px-20 py-12 placeholder-gray-300'}
          placeholder='건물 이름(name)으로 원하는 건물 검색'
          aria-label='SearchInput'
          displayValue={(building: showBuildingType) => building?.name ?? ''}
          onChange={(event) => setQuery(event.target.value)}
        />
        <BuildingCell building={BUILDING_LIST_HEADER} />

        <ComboboxOptions
          static
          anchor='bottom'
          transition
          className={'mt-64 h-488 w-[var(--input-width)]'}
        >
          {filteredBuildingList?.map((building: showBuildingType) => (
            <ComboboxOption
              key={building._id}
              value={building}
              className='mt-[2px] flex cursor-default select-none items-center bg-[#f1f1f1] py-4'
            >
              {/* 빌딩 list cells */}
              <BuildingCell building={building} />
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </Combobox>
    </div>
  );
};

const BuildingCell = (props: { building: showBuildingType }) => {
  const { building } = props;
  const router = useRouter();

  const { handleServerReq } = useHandleServerReq({ router });

  const handleBuildingDelete = async (id: number) => {
    handleServerReq({
      reqFunc: () => deleteBuildingData(id),
      toastMsg: '성공적으로 해당 건물 정보를 삭제하였습니다!',
      queryKey: ['buildings'],
    });
  };

  return (
    <div
      className={`flex w-full justify-between rounded-4 p-8 text-center font-500 shadow ${building._id === 0 ? 'bg-[#4a4a4a] text-white' : 'bg-white'}`}
    >
      <h5 className=' w-44 font-800'>
        {building._id === 0 ? '건물ID' : building._id}
      </h5>
      <h5 className='w-160 overflow-hidden whitespace-nowrap'>
        {building.name}
      </h5>
      <h5 className='w-80'>
        {building._id === 0 ? '카테고리' : building.cate}
      </h5>
      <h5 className='w-252 whitespace-nowrap'>{building.address}</h5>

      <h5 className='w-[150px] break-words'>{building.img}</h5>
      <h5 className='w-52'>
        {building._id === 0 ? '직영 건물' : building.isours ? 'O' : 'X'}
      </h5>
      <h5 className='w-52'>
        {building._id === 0 ? building.scanUrl : building.scanUrl ? 'O' : 'X'}
      </h5>
      <h5 className='w-[120px]'>{building.tag}</h5>
      <div className='max-h-100 w-280 overflow-y-auto'>
        {building._id === 0
          ? '팝업 목록 (팝업 이름)'
          : building.popups?.map((el: PopupType, idx: number) => (
              <p key={idx}>{el.name}</p>
            ))}
      </div>
      {building._id ? (
        <div className='flex h-fit items-center gap-4'>
          <div
            onClick={() => {
              const isBdlgEditConfirm = confirm(
                `[✏️건물 수정]\nID: ${building._id}, 이름: ${building.name} 빌딩 정보를 수정하시겠습니까?\n확인을 누르면 건물 정보 수정 페이지로 이동합니다.`,
              );
              if (isBdlgEditConfirm)
                router.push(`/admin/건물 정보 수정?id=${building._id}`);
            }}
          >
            <IconEditPencil />
          </div>
          <div
            className='w-fit cursor-pointer overflow-ellipsis text-[#000000]'
            onClick={() => {
              const res = confirm(
                `[‼️건물 삭제]\n ID: ${building._id}, 이름: ${building.name} 유저를 DB에서 정말로 삭제하시겠습니까?`,
              );
              if (!res) return;
              handleBuildingDelete(building._id);
            }}
          >
            <IconClose />
          </div>
        </div>
      ) : (
        <div className='w-68'></div>
      )}
    </div>
  );
};

export default ShowAndDeleteBuilding;
