import { ReactNode, useState } from 'react';
import { parseNumberWithComma } from 'utils/parseNumberWithComma';
import { BuildingDataType, PageType } from 'types/client.types';
import { IconChange } from 'public/icons';
import DescriptionCard from './DescriptionCard';

type UnitType = 'pyeong' | 'meter';

const BuildingInfoCard = (props: {
  data: BuildingDataType | undefined;
  page: PageType;
}) => {
  const { data, page } = props;

  const [unit, setUnit] = useState<UnitType>('pyeong');

  const handleChangeUnit = () => {
    setUnit((prev) => (prev === 'pyeong' ? 'meter' : 'pyeong'));
  };

  const parseArea = (area: number | undefined | null, unit: UnitType) => {
    if (!area) {
      return '-';
    }

    if (unit === 'pyeong') {
      const parsedArea = parseNumberWithComma(
        Math.round(area * 0.3025 * 100) / 100,
      );
      return parsedArea + '평';
    } else {
      const parsedArea = parseNumberWithComma(area);
      return parsedArea + '㎡';
    }
  };

  const parsePercent = (percent: number | undefined | null) => {
    if (!percent) {
      return '-';
    }
    const parsedPercent =
      parseNumberWithComma(Math.round(percent * 100) / 100) + '%';
    return parsedPercent;
  };

  const parseData = (data: any, unit: string) => {
    if (data === null || data === undefined) {
      return '-';
    }

    return data + unit;
  };

  return (
    <DescriptionCard page={page}>
      <button
        onClick={handleChangeUnit}
        className='absolute -top-36 right-4 flex h-28 w-48 shrink-0 items-center gap-4 rounded-8 border border-gray-200 pl-[6px] pr-4 font-600'
      >
        <IconChange />
        {unit === 'pyeong' ? '㎡' : '평'}
      </button>
      <div className='flex flex-col gap-16'>
        <BuildingInfo name='연면적'>
          {parseArea(data?.연면적, unit)}
        </BuildingInfo>
        <BuildingInfo name='용적률'>{parsePercent(data?.용적률)}</BuildingInfo>
        <BuildingInfo name='건폐율'>{parsePercent(data?.건폐율)}</BuildingInfo>
        <BuildingInfo name='주용도'>
          {data?.주용도 ? data.주용도 : '-'}
        </BuildingInfo>
        <BuildingInfo name='사용승인일'>
          {data?.사용승인일 ? data.사용승인일 : '-'}
        </BuildingInfo>
        <BuildingInfo name='지상층수'>
          {parseData(data?.지상층수, '층')}
        </BuildingInfo>
        <BuildingInfo name='지하층수'>
          {parseData(data?.지하층수, '층')}
        </BuildingInfo>
        <BuildingInfo name='주차대수'>
          {parseData(data?.주차대수, '대')}
        </BuildingInfo>
        <BuildingInfo name='승강기'>
          {parseData(data?.승강기, '대')}
        </BuildingInfo>
      </div>
    </DescriptionCard>
  );
};

export default BuildingInfoCard;

const BuildingInfo = (props: { name: string; children: ReactNode }) => {
  const { name, children } = props;
  return (
    <div className='flex items-center justify-between'>
      <span className='text-18 font-600'>{name}</span>
      <span className='text-16 font-500'>{children}</span>
    </div>
  );
};
