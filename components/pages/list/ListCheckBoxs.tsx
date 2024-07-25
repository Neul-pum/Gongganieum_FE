const ListCheckBoxs = (props: {
  isours: boolean;
  iscurrent: boolean;
  onClickIsPopup: () => void;
  onClickOurs: () => void;
}) => {
  const { isours, iscurrent, onClickIsPopup, onClickOurs } = props;

  return (
    <div className='flex gap-[10px] py-8'>
      <CheckBoxInput
        text='진행중인 팝업'
        onChange={onClickIsPopup}
        isClicked={iscurrent}
      />
      <CheckBoxInput
        text='직영 건물'
        onChange={onClickOurs}
        isClicked={isours}
      />
    </div>
  );
};

export default ListCheckBoxs;

const CheckBoxInput = (props: {
  text: string;
  onChange: () => void;
  isClicked: boolean;
}) => {
  const { text, onChange, isClicked } = props;
  return (
    <div className='flex items-center justify-center gap-8'>
      <input
        type='checkbox'
        checked={isClicked}
        onChange={onChange}
        className='h-16	w-16 appearance-none rounded-4 border border-solid bg-gray-100 checked:border-0 checked:bg-[url("/icons/black-check.svg")] checked:bg-auto checked:bg-center checked:bg-no-repeat'
      />
      <span className='text-14 font-500'>{text}</span>
    </div>
  );
};
