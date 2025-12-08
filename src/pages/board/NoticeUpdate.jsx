import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/httpClient';
import { UserContext } from '../../context/UserContext';
import NoticeForm from '../board/NoticeForm';

const NoticeUpdate = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { userRole } = useContext(UserContext);

	const [initialValues, setInitialValues] = useState({
		category: '[일반]',
		title: '',
		content: '',
	});

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

	const loadNotice = async () => {
		try {
			const res = await api.get(`/notice/read/${id}`);
			const n = res.data.notice;

			setInitialValues({
				category: n.category ?? '[일반]',
				title: n.title ?? '',
				// read에서 <br> 변환되어 올 수 있어서 줄바꿈 복원
				content: (n.content ?? '').replaceAll('<br>', '\n'),
			});
		} catch (e) {
			console.error('공지 수정 데이터 로드 실패:', e);
		}
	};

	// eslint-disable-next-line react-hooks/rules-of-hooks
	useEffect(() => {
		loadNotice();
	}, [id]);

	const handleUpdate = async ({ category, title, content }) => {
		try {
			const params = new URLSearchParams();
			params.append('category', category);
			params.append('title', title);
			params.append('content', content);

			await api.patch(`/notice/update/${id}`, params, {
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			});

			alert('공지 수정 완료!');
			navigate(`/notice/read/${id}`);
		} catch (e) {
			console.error('공지 수정 실패:', e);
			alert('공지 수정 실패');
		}
	};

	return (
		<div className="form-container">
			<h3>공지 수정</h3>
			<div className="split--div"></div>

			<NoticeForm
				initialValues={initialValues}
				onSubmit={handleUpdate}
				onCancel={() => navigate(-1)}
				submitLabel="수정"
				enableFile={false}
			/>
		</div>
	);
};

export default NoticeUpdate;
