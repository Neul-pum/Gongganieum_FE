import { forwardRef } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import RequiredStar from 'components/commons/RequiredStar';

const TextInput = (props: {
  register: UseFormRegisterReturn;
  label: string;
  placeholder?: string;
  isRequired?: boolean;
  type?: string;
}) => {
  const {
    register,
    label,
    placeholder = '',
    isRequired = false,
    type = 'text',
  } = props;

  return (
    <div className='flex w-full items-center justify-between'>
      <div>
        <label className='mr-4 text-20 font-600'>{label}</label>
        {isRequired && <RequiredStar />}
      </div>
      <input
        {...register}
        placeholder={placeholder ? placeholder : `${label} 입력`}
        type={type}
        className='w-400 rounded-full bg-[#f1f1f1] px-20 py-12 placeholder-gray-300'
      />
    </div>
  );
};

export default forwardRef(TextInput);
