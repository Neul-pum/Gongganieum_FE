import { ERROR_MESSAGES } from 'constants/form';
import 'react-datepicker/dist/react-datepicker.css';
import { useFormContext } from 'react-hook-form';
import { ContactFormValues } from 'pages/contact/[id]';
import Button from 'components/commons/Button';
import Input from 'components/commons/Input';
import RequiredStar from 'components/commons/RequiredStar';
import DateInput from '../DateInput';
import TextInput from '../TextInput';

const UsageInfoStep = (props: {
  handlePrevStep: () => void;
  handleNextStep: () => void;
}) => {
  const { handlePrevStep, handleNextStep } = props;

  const {
    control,
    setValue,
    getValues,
    trigger,
    formState,
    setError,
    clearErrors,
  } = useFormContext<ContactFormValues>();

  const setPrimaryStartDate = (date: string) => {
    setValue('primaryStartDate', date);
  };
  const setPrimaryEndDate = (date: string) => {
    setValue('primaryEndDate', date);
  };
  const setSecondaryStartDate = (date: string) => {
    setValue('secondaryStartDate', date);
  };
  const setSecondaryEndDate = (date: string) => {
    setValue('secondaryEndDate', date);
  };

  const {
    primaryStartDate,
    primaryEndDate,
    secondaryStartDate,
    secondaryEndDate,
  } = getValues();

  const checkForm = async () => {
    const isFormValid = await trigger(['budget', 'purpose']);
    const isDateValid =
      getValues('primaryStartDate') && getValues('primaryEndDate');

    if (isDateValid) {
      clearErrors('primaryStartDate');
    } else {
      setError('primaryStartDate', {
        type: 'required',
        message: ERROR_MESSAGES.required.date,
      });
    }

    if (isFormValid && isDateValid) {
      handleNextStep();
    }
  };

  return (
    <div className='flex w-full flex-col gap-16'>
      <div className='w-full'>
        <div className='flex w-full flex-col gap-12'>
          <DateInput
            label='일정'
            startDate={primaryStartDate}
            endDate={primaryEndDate}
            setStartDate={setPrimaryStartDate}
            setEndDate={setPrimaryEndDate}
            required
            errorMessage={formState.errors.primaryStartDate?.message}
          />
          <DateInput
            label='차순위 일정'
            startDate={secondaryStartDate}
            endDate={secondaryEndDate}
            setStartDate={setSecondaryStartDate}
            setEndDate={setSecondaryEndDate}
          />
        </div>
      </div>
      <Input
        name='budget'
        placeholder='0'
        rules={{
          required: ERROR_MESSAGES.required.budget,
        }}
        type='number'
        control={control}
      >
        예산
        <RequiredStar />
        <div className='absolute bottom-[22px] right-12 text-16 font-500'>
          원
        </div>
      </Input>
      <TextInput
        name='purpose'
        placeholder='사용 목적을 입력해주세요.'
        maxLength={1000}
        rules={{
          required: ERROR_MESSAGES.required.purpose,
          maxLength: { value: 4000, message: ERROR_MESSAGES.maxLength.purpose },
        }}
        control={control}
      >
        사용 목적
        <RequiredStar />
      </TextInput>
      <div className='grid h-64 w-full grid-cols-[3fr_7fr] gap-4 bg-white py-8 md:fixed md:bottom-0 md:left-0 md:px-8'>
        <Button onClick={handlePrevStep}>이전</Button>
        <Button onClick={checkForm}>다음</Button>
      </div>
    </div>
  );
};

export default UsageInfoStep;
