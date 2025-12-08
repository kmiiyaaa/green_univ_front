import { useEffect, useState } from 'react';
import InputForm from '../../components/form/InputForm';

/**
 * 공통 공지 폼
 *
 * props
 * - initialValues: { category, title, content }
 * - onSubmit: async ({ category, title, content, file }) => void
 * - onCancel: () => void
 * - submitLabel: string
 * - enableFile: boolean (기본 true)
 */

const NoticeForm = ({
	initialValues = { category: '[일반]', title: '', content: '' },
	onSubmit,
	onCancel,
	submitLabel = '저장',
	enableFile = true,
}) => {
	const [category, setCategory] = useState('[일반]');
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [file, setFile] = useState(null);

	// 초기값 주입 (Update에서 fetch 후 주입할 때 필요)
	useEffect(() => {
		setCategory(initialValues.category ?? '[일반]');
		setTitle(initialValues.title ?? '');
		setContent(initialValues.content ?? '');
		// 수정폼에서는 기본적으로 파일을 안 쓰는 구조라 초기 file은 유지하지 않음?
		// 필요하면 initialValues.file 같은 확장도 가능
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initialValues?.category, initialValues?.title, initialValues?.content]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!onSubmit) return;

		await onSubmit({
			category,
			title,
			content,
			file,
		});
	};

	return (
		<form onSubmit={handleSubmit} className="write--div">
			<div className="title--container" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
				<div className="category">
					<select name="category" className="input--box" value={category} onChange={(e) => setCategory(e.target.value)}>
						<option value="[일반]">[일반]</option>
						<option value="[학사]">[학사]</option>
						<option value="[장학]">[장학]</option>
					</select>
				</div>

				<div className="title" style={{ flex: 1 }}>
					<InputForm
						label="제목"
						name="title"
						placeholder="제목을 입력하세요"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
				</div>
			</div>

			<div className="content--container" style={{ marginTop: 12 }}>
				<label style={{ display: 'block', marginBottom: 6 }}>내용</label>
				<textarea
					name="content"
					className="form-control"
					cols="100"
					rows="20"
					placeholder="내용을 입력하세요"
					value={content}
					onChange={(e) => setContent(e.target.value)}
					style={{ width: '100%' }}
				/>
			</div>

			{enableFile && (
				<div className="custom-file" style={{ marginTop: 12 }}>
					<input
						type="file"
						className="custom-file-input"
						name="file"
						accept=".jpg, .jpeg, .png"
						onChange={(e) => setFile(e.target.files?.[0] || null)}
					/>
				</div>
			)}

			<div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
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
