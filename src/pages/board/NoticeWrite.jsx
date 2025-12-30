import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/httpClient';
import { UserContext } from '../../context/UserContext';
import NoticeForm from '../board/NoticeForm';
import { useMutation } from '@tanstack/react-query';

export default function NoticeWrite() {
	const navigate = useNavigate();
	const { userRole } = useContext(UserContext);

	// 등록 로직을 Mutation으로 정의
	const createNoticeMutation = useMutation({
		// ✅ FormData 업로드에서도 Authorization이 "무조건" 붙도록 한 번 더 보강
		// - 일부 환경(특히 배포/프록시/멀티파트)에서 interceptor가 누락되거나 headers가 덮이는 케이스 방어
		// - Content-Type은 지정하지 말고(axios가 boundary 포함 자동 설정), Authorization만 확실히 세팅
		mutationFn: (formData) => {
			const token = localStorage.getItem('token'); // httpClient interceptor와 동일 소스 사용
			return api.post('/notice/write', formData, {
				headers: token ? { Authorization: `Bearer ${token}` } : undefined,
			});
		},
		onSuccess: () => {
			alert('공지 등록 완료!');
			navigate('/notice');
		},
		onError: (error) => {
			// ✅ 서버가 내려준 에러 메시지가 있으면 같이 찍어서 원인 파악이 쉬움
			console.error('등록 실패:', error?.response?.status, error?.response?.data ?? error);
			alert('공지 등록 실패');
		},
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

	const handleCreate = async ({ category, title, content, file /*, removeFile */ }) => {
		const formData = new FormData();
		formData.append('category', category);
		formData.append('title', title);
		formData.append('content', content);
		if (file) formData.append('file', file);

		createNoticeMutation.mutate(formData);
	};

	return (
		<div className="form-container">
			<h3>공지 등록</h3>
			<div className="split--div"></div>

			<NoticeForm
				initialValues={{ category: '[일반]', title: '', content: '' }}
				onSubmit={handleCreate}
				onCancel={() => navigate('/notice')}
				submitLabel={createNoticeMutation.isPending ? '등록 중...' : '등록'} // 로딩 상태 활용
				enableFile={true}
			/>
		</div>
	);
}
