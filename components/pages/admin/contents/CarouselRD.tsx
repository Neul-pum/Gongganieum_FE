import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react';
import { useQuery } from '@tanstack/react-query';
import { CAROUSEL_LIST_HEADER } from 'constants/adminContentTableHeader';
import { useRouter } from 'next/router';
import { useState } from 'react';
import useHandleServerReq from 'hooks/useHandleServerReq';
import { deleteCarouselData } from 'apis/admin';
import { getAllCarouselInfo } from 'apis/api';
import { CarouselType } from 'types/client.types';
import { IconClose, IconEditPencil } from 'public/icons';

const ShowAndDeleteCarousels = () => {
  const { data: allCarouselInfos } = useQuery({
    queryKey: ['carousels'],
    queryFn: getAllCarouselInfo,
  });

  const [selectedUser, setSelectedUser] = useState<CarouselType>();
  const [query, setQuery] = useState('');

  const filteredUserList =
    query === ''
      ? allCarouselInfos
      : allCarouselInfos?.filter((carousel: CarouselType) => {
          return carousel.content.name
            .toLowerCase()
            .includes(query.toLowerCase());
        });

  return (
    <div className='-mt-12 h-680 w-1340 rounded-8 bg-[#f1f1f1] p-20'>
      <h3 className='mb-12 ml-8 mt-4 text-20 font-700'>캐러셀 검색</h3>
      <Combobox
        value={selectedUser}
        onChange={(value) => {
          if (value?._id) setSelectedUser(value!);
        }}
      >
        <ComboboxInput
          className={'mb-16 w-full rounded-16 px-20 py-12 placeholder-gray-300'}
          placeholder='캐러셀 컨텐츠 ID로 검색'
          aria-label='SearchInput'
          displayValue={(carousel: CarouselType) =>
            carousel?.content.name ?? ''
          }
          onChange={(event) => setQuery(event.target.value)}
        />
        <CarouselListCell carousel={CAROUSEL_LIST_HEADER} />

        <ComboboxOptions
          static
          anchor='bottom'
          transition
          className={'mt-56 h-500 w-[var(--input-width)]'}
        >
          {filteredUserList?.map((carousel: CarouselType) => (
            <ComboboxOption
              key={carousel._id}
              value={carousel}
              className='mt-[2px] flex cursor-default select-none items-center bg-[#f1f1f1] py-[3px]'
            >
              {/* 케러셀 list cells */}
              <CarouselListCell carousel={carousel} />
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </Combobox>
    </div>
  );
};

const CarouselListCell = (props: { carousel: CarouselType }) => {
  const { carousel } = props;

  const router = useRouter();

  const { handleServerReq } = useHandleServerReq({ router });

  const handleCarouselDelete = async (id: number) => {
    handleServerReq({
      reqFunc: () => deleteCarouselData(id),
      toastMsg: '성공적으로 해당 캐러셀 정보를 삭제하였습니다!',
      queryKey: ['carousels'],
    });
  };

  return (
    <div
      className={`flex w-full justify-between rounded-4 p-8 text-center font-500 shadow ${carousel._id === 0 ? 'bg-[#4a4a4a] text-white' : 'bg-white'}`}
    >
      <h5 className='w-100 overflow-ellipsis font-700'>
        {carousel._id === 0 ? '캐러셀 ID' : carousel._id}
      </h5>
      <h5 className='w-160 overflow-ellipsis'>{carousel.carouselType}</h5>
      <h5 className='w-160 overflow-ellipsis'>{carousel.contentType}</h5>
      <h5 className='w-100 overflow-ellipsis'>{carousel.pageType}</h5>
      <h5 className='w-100 overflow-ellipsis'>
        {carousel._id === 0 ? '컨텐츠 ID' : carousel.contentId}
      </h5>
      <div className='max-h-100 w-[420px] overflow-y-auto overflow-ellipsis'>
        {carousel._id === 0 ? (
          '캐러셀 컨텐츠 내용'
        ) : (
          <div>
            <h5 className='w-full overflow-ellipsis font-700'>
              건물 이름: {carousel.content?.name}
            </h5>
            <h5 className='w-full overflow-ellipsis'>
              주소: {carousel.content?.address}
            </h5>
            <h5 className='w-full overflow-ellipsis'>
              카테고리: {carousel.content?.cate}
            </h5>
            <h5 className='w-full overflow-ellipsis'>
              태그: {carousel.content?.tag}
            </h5>
          </div>
        )}
      </div>
      {carousel._id ? (
        <div className='flex h-fit w-100 items-center justify-evenly'>
          <div
            onClick={() => {
              const isCarouselEditConfirm = confirm(
                `[✏️캐러셀 수정]\nID: ${carousel._id} 캐러셀 데이터를 수정하시겠습니까?\n확인을 누르면 캐러셀 정보 수정 페이지로 이동합니다.`,
              );
              if (isCarouselEditConfirm)
                router.push(`/admin/캐러셀 정보 수정?id=${carousel._id}`);
            }}
          >
            <IconEditPencil />
          </div>
          <div
            className='w-32 cursor-pointer overflow-ellipsis text-[#000000]'
            onClick={() => {
              const res = confirm(
                `[‼️캐러셀 삭제]\nID: ${carousel._id} 캐러셀 데이터를 DB에서 정말로 삭제하시겠습니까?`,
              );
              if (!res) return;
              handleCarouselDelete(carousel._id);
            }}
          >
            <IconClose />
          </div>
        </div>
      ) : (
        <div className='w-120'></div>
      )}
    </div>
  );
};
export default ShowAndDeleteCarousels;
