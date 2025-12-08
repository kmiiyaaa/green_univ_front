import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/httpClient';
import { UserContext } from '../../context/UserContext';
import NoticeForm from '../board/NoticeForm';

const NoticeWrite = () => {
	const navigate = useNavigate();
	const { userRole } = useContext(UserContext);

	if (userRole !== 'staff') {
		return (
			<div className="form-container">
				권한이 없습니다.
				<button className="button" onClick={() => navigate(-1)}>
					뒤로
				</button>
			</div>
		);
	}

	const handleCreate = async ({ category, title, content, file }) => {
		try {
			const formData = new FormData();
			formData.append('category', category);
			formData.append('title', title);
			formData.append('content', content);
			if (file) formData.append('file', file);

			await api.post('/notice/write', formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			});

			alert('공지 등록 완료!');
			navigate('/notice');
		} catch (e) {
			console.error('공지 등록 실패:', e);
			alert('공지 등록 실패');
		}
	};

	return (
		<div className="form-container">
			<h3>공지 등록</h3>
			<div className="split--div"></div>

			<NoticeForm
				initialValues={{ category: '[일반]', title: '', content: '' }}
				onSubmit={handleCreate}
				onCancel={() => navigate('/notice')}
				submitLabel="등록"
				enableFile={true}
			/>
		</div>
	);
};

export default NoticeWrite;
