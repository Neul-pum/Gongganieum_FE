import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react';
import { useQuery } from '@tanstack/react-query';
import { CONTACT_LIST_HEADER } from 'constants/adminContentTableHeader';
import { useRouter } from 'next/router';
import { useState } from 'react';
import useHandleServerReq from 'hooks/useHandleServerReq';
import { deleteContactData } from 'apis/admin';
import { getAllBuildingContactInfo } from 'apis/api';
import { ContactType } from 'types/client.types';
import { IconClose } from 'public/icons';

const ShowAndDeleteContacts = () => {
  const { data: allContactInfos } = useQuery({
    queryKey: ['contacts'],
    queryFn: getAllBuildingContactInfo,
  });

  const [selectedContact, setSelectedContact] = useState<ContactType>();
  const [query, setQuery] = useState('');

  const filteredUserList =
    query === ''
      ? allContactInfos
      : allContactInfos?.filter((contact: ContactType) => {
          return contact.name.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <div className='-mt-12 h-680 w-1460 rounded-8 bg-[#f1f1f1] p-20'>
      <h3 className='mb-12 ml-8 mt-4 text-20 font-700'>문의 검색</h3>
      <Combobox
        value={selectedContact}
        onChange={(value) => {
          if (value?._id) setSelectedContact(value!);
        }}
      >
        <ComboboxInput
          className={'mb-16 w-full rounded-16 px-20 py-12 placeholder-gray-300'}
          placeholder='문의한 유저 ID로 문의 검색'
          aria-label='SearchInput'
          displayValue={(contact: ContactType) => contact.name ?? ''}
          onChange={(event) => setQuery(event.target.value)}
        />
        <ContactListCell contact={CONTACT_LIST_HEADER} />

        <ComboboxOptions
          static
          anchor='bottom'
          transition
          className={'mt-56 h-500 w-[var(--input-width)]'}
        >
          {filteredUserList?.map((carousel: ContactType) => (
            <ComboboxOption
              key={carousel._id}
              value={carousel}
              className='mt-[2px] flex cursor-default select-none items-center bg-[#f1f1f1] py-[3px]'
            >
              {/* 문의 list cells */}
              <ContactListCell contact={carousel} />
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </Combobox>
    </div>
  );
};

const ContactListCell = (props: { contact: ContactType }) => {
  const { contact } = props;
  const router = useRouter();

  const { handleServerReq } = useHandleServerReq({ router });

  const handleContactDelete = async (id: number) => {
    handleServerReq({
      reqFunc: () => deleteContactData(id),
      toastMsg: '성공적으로 해당 문의 정보를 삭제하였습니다!',
      queryKey: ['contacts'],
    });
  };
  return (
    <div
      className={`flex w-full rounded-4 p-8 text-center font-500 shadow ${contact._id === 0 ? 'bg-[#4a4a4a] text-white' : 'bg-white'}`}
    >
      <h5 className='w-72 overflow-ellipsis font-800'>
        {contact._id === 0 ? 'ID' : contact._id}
      </h5>
      <h5 className='w-160 overflow-ellipsis'>
        {contact._id === 0 ? '작성 날짜' : contact.addedDate}
      </h5>
      <h5 className='w-100 overflow-ellipsis'>
        {contact._id === 0 ? '유저 ID' : contact.userId}
      </h5>
      <h5 className='w-100 overflow-ellipsis'>
        {' '}
        {contact._id === 0 ? '빌딩 ID' : contact.buildingId}
      </h5>
      <h5 className='w-180 overflow-hidden overflow-ellipsis '>
        {contact.name}
      </h5>
      <h5 className='w-180 overflow-hidden overflow-ellipsis '>
        {contact.email}
      </h5>
      <h5 className='w-180 overflow-ellipsis'>{contact.phone}</h5>
      <h5 className='w-180 overflow-hidden overflow-ellipsis '>
        {contact.company}
      </h5>
      <h5 className='w-180 overflow-ellipsis'>{contact.date1}</h5>
      {contact.date2 ? (
        <h5 className='w-180 overflow-ellipsis'>{contact.date2}</h5>
      ) : (
        <></>
      )}
      <h5 className='w-220 overflow-ellipsis'>{contact.areaList}</h5>
      <h5 className='w-160 overflow-ellipsis'>{contact.size}</h5>
      <h5 className='w-160 overflow-ellipsis'>{contact.budget}</h5>
      <h5 className='w-180 overflow-hidden overflow-ellipsis '>
        {contact.reason}
      </h5>
      <h5 className='w-160 overflow-hidden overflow-ellipsis '>
        {contact.enterpath}
      </h5>
      <h5 className='max-h-60 w-200 overflow-y-auto overflow-ellipsis'>
        {contact.requests}
      </h5>

      {contact._id ? (
        <div
          className='w-40 cursor-pointer overflow-ellipsis text-[#000000]'
          onClick={() => {
            const res = confirm(
              `[‼️문의 삭제]\nID: ${contact._id}의 문의 데이터를 DB에서 정말로 삭제하시겠습니까?`,
            );
            if (!res || !contact._id) return;
            handleContactDelete(contact._id);
          }}
        >
          <IconClose></IconClose>
        </div>
      ) : (
        <div className='w-44'></div>
      )}
    </div>
  );
};
export default ShowAndDeleteContacts;
