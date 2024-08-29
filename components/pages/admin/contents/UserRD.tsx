import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react';
import { useQuery } from '@tanstack/react-query';
import { USER_LIST_HEADER } from 'constants/adminContentTableHeader';
import { useRouter } from 'next/router';
import { useState } from 'react';
import useHandleServerReq from 'hooks/useHandleServerReq';
import { deleteUserData } from 'apis/admin';
import { getAllUserInfo } from 'apis/api';
import { UserDataType } from 'types/client.types';
import { IconClose } from 'public/icons';

const ShowAndDeleteUsers = () => {
  const { data: allUserInfos } = useQuery({
    queryKey: ['users'],
    queryFn: getAllUserInfo,
  });

  const [selectedUser, setSelectedUser] = useState<UserDataType>();
  const [query, setQuery] = useState('');

  const filteredUserList =
    query === ''
      ? allUserInfos
      : allUserInfos?.filter((userInfo: UserDataType) => {
          return userInfo.name.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <div className='-mt-12 h-680 w-1340 rounded-8 bg-[#f1f1f1] p-20'>
      <h3 className='mb-12 ml-8 mt-4 text-20 font-700'>유저 검색</h3>
      <Combobox
        value={selectedUser}
        onChange={(value) => {
          if (value?._id) setSelectedUser(value!);
        }}
      >
        <ComboboxInput
          className={'mb-20 w-full rounded-16 px-20 py-12 placeholder-gray-300'}
          placeholder='이름(name)으로 원하는 유저 검색'
          aria-label='SearchInput'
          displayValue={(user: UserDataType) => user?.name ?? ''}
          onChange={(event) => setQuery(event.target.value)}
        />
        <UserListCell user={USER_LIST_HEADER} />

        <ComboboxOptions
          static
          anchor='bottom'
          transition
          className={'mt-64 h-488 w-[var(--input-width)]'}
        >
          {filteredUserList?.map((user: UserDataType) => (
            <ComboboxOption
              key={user._id}
              value={user}
              className='mt-[2px] flex cursor-default select-none items-center bg-[#f1f1f1] py-4'
            >
              {/* 유저 list cells */}
              <UserListCell user={user} />
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </Combobox>
    </div>
  );
};

const UserListCell = (props: { user: UserDataType }) => {
  const { user } = props;
  const router = useRouter();

  const { handleServerReq } = useHandleServerReq({ router });

  const handleUserDelete = async (id: number) => {
    handleServerReq({
      reqFunc: () => deleteUserData(id),
      toastMsg: '성공적으로 해당 유저 정보를 삭제하였습니다!',
      queryKey: ['users'],
    });
  };

  return (
    <div
      className={`flex w-full rounded-4 p-8 text-center font-500 shadow ${user._id === 0 ? 'bg-[#4a4a4a] text-white' : 'bg-white'}`}
    >
      <h5 className='w-44 overflow-ellipsis font-800'>
        {user._id === 0 ? 'ID' : user._id}
      </h5>
      <h5 className='w-80 overflow-ellipsis'>{user.name}</h5>
      <h5 className='w-80 overflow-ellipsis'>
        {user._id === 0 ? '로그인 상태' : user.role}
      </h5>
      <h5 className='w-140 overflow-ellipsis'>{user.nickname}</h5>
      <h5 className='w-60 overflow-ellipsis'>{user.age}</h5>
      <h5 className='w-52 overflow-ellipsis'>
        {user._id === 0
          ? '성별'
          : user.sex === 'M'
            ? '남성'
            : user.sex === 'F'
              ? '여성'
              : ''}
      </h5>
      <h5 className='w-220 overflow-ellipsis'>{user.email}</h5>
      <h5 className='w-120 overflow-ellipsis'>{user.company}</h5>
      <h5 className='w-132 overflow-ellipsis'>{user.brand}</h5>
      <h5 className='w-160 overflow-ellipsis'>{user.tag}</h5>
      <h5 className='w-300 overflow-ellipsis'>{user.description}</h5>
      <h5 className='w-172 overflow-ellipsis'>{user.phone}</h5>
      {user._id ? (
        <div
          className={`w-fit cursor-pointer overflow-ellipsis text-[#000000]`}
          onClick={() => {
            const res = confirm(
              `[‼️유저 삭제]\n ID: ${user._id}, 이름: ${user.name} 유저를 DB에서 정말로 삭제하시겠습니까?`,
            );
            if (!res) return;

            handleUserDelete(user._id);
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
export default ShowAndDeleteUsers;
