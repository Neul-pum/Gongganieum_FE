import { useRouter } from 'next/router';
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useCookies } from 'react-cookie';
import toast from 'react-hot-toast';
import 'react-quill/dist/quill.snow.css';
import { authorizeAdmin } from 'apis/admin';
import { postEditorImage, postMagazine } from 'apis/api';

const EditorPage = () => {
  const quillRef = useRef<any>(null);
  const router = useRouter();

  const [value, setValue] = useState({
    title: '',
    writer: '',
    category: '',
  });
  const [cookie, setCookie] = useCookies(['editor_access']);
  const [thumbnailImage, setThumbnailImage] = useState<string>('');
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<string>('');
  const [editorValue, setEditorValue] = useState('');

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setValue((prevValue) => ({
      ...prevValue,
      [e.target.name]: e.target.value,
    }));
  };

  const [isClient, setIsClient] = useState(false);

  // CSR에서만 ReactQuill을 불러옴
  useEffect(() => {
    setIsClient(true);
  }, []);

  const ReactQuill = isClient ? require('react-quill') : () => false;

  // 비밀번호
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (await isEditorLoginSuccess(password)) {
      toast.success('에디터로 로그인 되었습니다!');
      const expiration = new Date(Date.now() + 3600 * 1000); // 1시간
      setCookie('editor_access', true, {
        secure: false,
        sameSite: 'lax',
        path: '/',
        expires: expiration,
      });
      setIsAuthorized(true);
    }
  };

  const isEditorLoginSuccess = async (pwd: string) => {
    const authorizeStatus = await authorizeAdmin({ pwd, user: 'editor' });
    switch (authorizeStatus) {
      case 200:
        return true;
      case 409:
        toast.error(
          'DB에서 정보를 불러오는 데 오류가 발생하였습니다.\n다시 시도해주세요.',
        );
        return false;
      case 400:
        toast.error('비밀번호가 잘못되었습니다!');
        return false;
      default:
        toast.error('문제가 발생하였습니다. 관리자에게 문의하세요.');
        return false;
    }
  };

  // 썸네일 업로드
  const handleThumbnailUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnailImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    const response = await handleImageUpload(file);
    setThumbnailImageUrl(response);
  };

  // 이미지 업로드
  const handleImageUpload = async (file: File) => {
    const response = await postEditorImage(file);
    return response;
  };

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.addEventListener('change', async () => {
      if (input.files === null) return;
      const file = input.files?.[0];
      const imageUrl = await handleImageUpload(file as File); // BASE64에서 이미지 URL로 변경

      const editor = quillRef.current.getEditor();
      const range = editor.getSelection(); // 커서 위치 반환
      editor.insertEmbed(range.index, 'image', imageUrl); // 이미지 삽입
    });
  };

  // 작성하기
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!value.title || !value.writer || !value.category || !editorValue) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const date = today.getDate();
    const dateString = `${year}.${month < 10 ? `0${month}` : month}.${date < 10 ? `0${date}` : date}`;

    const res = await postMagazine({
      title: value.title,
      writer: value.writer,
      img: thumbnailImageUrl,
      date: dateString,
      cate: value.category,
      contentHTML: editorValue,
    });

    if (res === 201) {
      toast.success('게시물 작성이 완료되었습니다!');
      router.push('/magazine');
    } else {
      toast.error('게시물 작성에 실패했습니다.');
    }
  };

  // 리액트 퀼 설정 (모듈, 포맷)]
  // useMemo를 사용하지 않으면, 이미지 삽입할 때마다 modules가 리렌더링 되고, 리렌더링된 뒤에 커서 위치를 찾지 못해서 에러가 발생
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ size: ['small', false, 'large', 'huge'] }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],

          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'link', 'image'],

          [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],

          [{ color: [] }, { background: [] }],
          [{ align: [] }],

          ['clean'],
        ],
        handlers: {
          image: imageHandler, // 이미지 핸들러 추가
        },
      },
    }),
    [],
  );

  useEffect(() => {
    // Hydration Error 방지 위해 CSR에서 에디터 로그인 여부 쿠키 정보 체크
    if (cookie.editor_access) setIsAuthorized(true);
  }, []);

  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
  ];

  return (
    <div className='mx-auto my-40 flex min-h-[60dvh] max-w-1000 flex-col items-center gap-20'>
      {/* 비밀번호 입력 전 */}
      {!isAuthorized && (
        <div className='mx-auto my-40 flex min-h-[60dvh] max-w-1000 items-center gap-20'>
          <form onSubmit={handleLogin} className='flex items-center gap-20'>
            <input
              type='password'
              value={password}
              onChange={handlePasswordChange}
              placeholder='Enter password'
              className='h-80 w-full border-gray-200 text-[36px] font-700 placeholder:opacity-20 focus:border-gray-300 focus:outline-none'
            />
            <button
              type='submit'
              className='h-full whitespace-nowrap rounded-10 bg-black px-16 py-12 text-14 font-600 text-white'
            >
              Submit
            </button>
          </form>
        </div>
      )}
      {/* 비밀번호 입력 후 */}
      {isAuthorized && (
        <>
          <div className='flex w-full items-center justify-between'>
            <input
              name='title'
              value={value.title}
              onChange={handleChange}
              placeholder='제목을 입력해주세요'
              spellCheck={false}
              className='h-80 w-full border-gray-200 text-[36px] font-700 placeholder:opacity-20 focus:border-gray-300 focus:outline-none'
            />
            <button
              onClick={handleSubmit}
              className='h-full whitespace-nowrap rounded-10 bg-black px-16 py-12 text-14 font-600 text-white'
            >
              작성하기
            </button>
          </div>
          <div className='flex w-full items-center justify-between gap-24'>
            <input
              name='writer'
              value={value.writer}
              onChange={handleChange}
              placeholder='작성자를 입력해주세요'
              spellCheck={false}
              className='h-32 w-1/2 rounded-12 text-[20px] font-500  placeholder:opacity-20 focus:border-gray-300 focus:outline-none'
            />
            <select
              name='category'
              value={value.category}
              onChange={handleChange}
              className='rounded-12 border-r-8 border-transparent bg-[#f5f5f5] py-12 pl-12 pr-24 font-500 focus:outline-none'
            >
              <option>카테고리를 선택해주세요</option>
              <option>팝업 매거진</option>
              <option>공간 매거진</option>
              <option>인물 매거진</option>
            </select>
          </div>
          {/* 썸네일 */}
          <div className='flex w-full items-end justify-between'>
            {thumbnailImage && (
              <div className='flex flex-col gap-16'>
                <h1 className='text-20 font-700'>썸네일 이미지</h1>
                <img
                  src={thumbnailImage}
                  alt='썸네일 이미지'
                  className='w-360 object-cover'
                />
              </div>
            )}
            <input
              type='file'
              onChange={handleThumbnailUpload}
              accept='image/*'
            />
          </div>
          {isClient ? (
            <div className='min-w-1000 max-w-1232 pt-40'>
              <ReactQuill
                ref={quillRef}
                name='editor'
                theme='snow'
                formats={formats}
                modules={modules}
                value={editorValue}
                onChange={setEditorValue}
                placeholder='글을 작성해 주세요.'
                imageHandler={imageHandler}
              />
            </div>
          ) : (
            <div>Loading...</div>
          )}
        </>
      )}
    </div>
  );
};
export default EditorPage;
