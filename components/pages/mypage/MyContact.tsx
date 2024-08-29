import { useQuery } from '@tanstack/react-query';
import { NO_IMAGE_URL, ROOT_IMAGE_URL } from 'constants/common';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { getBuildingInfo } from 'apis/api';
import { UserContactType } from 'types/client.types';
import PortalModal from 'components/commons/PortalModal';
import MyContactModal from 'components/commons/modals/MyContactModal';
import { IconArrowRight } from 'public/icons';

const MyContact = (props: { contact: UserContactType }) => {
  const { contact } = props;
  const { data: buildingInfo } = useQuery({
    queryKey: ['user', 'contact-building', contact._id],
    queryFn: () => getBuildingInfo(contact.buildingId),
    enabled: !!contact.buildingId,
  });

  const imageUrls = buildingInfo?.img
    ?.split(',')
    ?.map((url) => ROOT_IMAGE_URL + url);
  const parsedAddedDate = contact.addedDate.split(' ')?.[0];

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className='flex h-180 w-full items-center gap-16 rounded-12 border border-gray-200 p-16 md:h-140'>
        <Link href={`/list/${contact.buildingId}`} legacyBehavior passHref>
          <a
            target='_blank'
            className='relative aspect-square h-full shrink-0 overflow-hidden rounded-8'
          >
            <Image
              src={imageUrls?.[0] ?? NO_IMAGE_URL}
              alt='빌딩 사진'
              fill
              className='object-cover'
            />
          </a>
        </Link>
        <div className='flex flex-col gap-8'>
          <div className='line-clamp-1 h-20 text-14 text-gray-300'>
            접수일: {parsedAddedDate}
          </div>
          <Link href={`/list/${contact.buildingId}`} legacyBehavior passHref>
            <a
              target='_blank'
              className='line-clamp-1 h-32 text-20 font-500 underline underline-offset-2'
            >
              {buildingInfo?.name}
            </a>
          </Link>
          <div className='line-clamp-1 h-20 text-gray-400'>
            {buildingInfo?.address}
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className='ml-auto flex shrink-0 items-center text-[#7799ff]'
        >
          상세보기
          <IconArrowRight stroke={'#7799ff'} width={16} stroke-width={2} />
        </button>
      </div>
      <PortalModal
        openStatus={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
      >
        <MyContactModal
          buildingName={buildingInfo?.name}
          addedDate={parsedAddedDate}
          contact={contact}
          closeModal={() => setIsModalOpen(false)}
        />
      </PortalModal>
    </>
  );
};

export default MyContact;
