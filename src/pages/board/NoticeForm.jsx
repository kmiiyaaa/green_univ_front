import { useEffect, useState } from 'react';
import InputForm from '../../components/form/InputForm';
import TextField from '../../components/form/TextField';
import OptionForm from '../../components/form/OptionForm';
import '../../assets/css/NoticeForm.css';

const NOTICE_CATEGORY_OPTIONS = [
	{ value: '[일반]', label: '일반' },
	{ value: '[학사]', label: '학사' },
	{ value: '[장학]', label: '장학' },
];

// 공통 공지폼
const NoticeForm = ({
	initialValues = { category: '[일반]', title: '', content: '' },
	onSubmit,
	onCancel,
	submitLabel = '저장',
	enableFile = true,
	currentFileName = '',
}) => {
	const [category, setCategory] = useState('[일반]');
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [file, setFile] = useState(null);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setCategory(initialValues.category ?? '[일반]');
		setTitle(initialValues.title ?? '');
		setContent(initialValues.content ?? '');
	}, [initialValues?.category, initialValues?.title, initialValues?.content]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!onSubmit) return;

		await onSubmit({ category, title, content, file });
	};

	return (
		<form onSubmit={handleSubmit} className="write--div">
			<div className="title--container">
				<div className="category">
					<OptionForm
						name="category"
						label="카테고리"
						value={category}
						onChange={(e) => setCategory(e.target.value)}
						options={NOTICE_CATEGORY_OPTIONS}
					/>
				</div>

				<div className="title">
					<InputForm
						label="제목"
						name="title"
						placeholder="제목을 입력하세요"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
				</div>
			</div>

			<div className="content--container">
				<label>내용</label>
				<TextField
					name="content"
					cols="100"
					rows="20"
					placeholder="내용을 입력하세요"
					value={content}
					onChange={(e) => setContent(e.target.value)}
				/>
			</div>

			{enableFile && (
				<div className="custom-file">
					<input
						type="file"
						className="custom-file-input"
						name="file"
						onChange={(e) => setFile(e.target.files?.[0] || null)}
					/>
					
					{/* 파일선택 아래쪽 현재 첨부파일 표시 */}
					{currentFileName && (
						<div className="notice-current-file">
							현재 첨부파일: {currentFileName}
						</div>
					)}
				</div>
			)}

			<div>
				<button type="button" className="button" onClick={onCancel}>
					목록
				</button>
				<button type="submit" className="button">
					{submitLabel}
				</button>
			</div>
		</form>
	);
};

export default NoticeForm;
