import { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/httpClient';
import { UserContext } from '../../context/UserContext';

const NoticeDetail = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { userRole } = useContext(UserContext);

	const [notice, setNotice] = useState(null);

	const loadNotice = async () => {
		try {
			const res = await api.get(`/notice/read/${id}`);
			setNotice(res.data.notice);
		} catch (e) {
			console.error('공지 상세 로드 실패:', e);
		}
	};

	useEffect(() => {
		loadNotice();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	const handleDelete = async () => {
		if (!window.confirm('정말 삭제할까요?')) return;
		try {
			await api.delete(`/notice/delete/${id}`);
			alert('삭제 완료');
			navigate('/notice');
		} catch (e) {
			console.error('공지 삭제 실패:', e);
			alert('삭제 실패');
		}
	};

	if (!notice) return <div className="form-container">로딩중...</div>;

	return (
		<div className="form-container">
			<h3>공지 상세</h3>
			<div className="split--div"></div>

			<table className="table">
				<tbody>
					<tr className="title">
						<td className="type">제목</td>
						<td>
							{notice.category} {notice.title}
						</td>
					</tr>
					<tr>
						<td className="type">작성일</td>
						<td>{notice.createdTime ? String(notice.createdTime) : ''}</td>
					</tr>
					<tr>
						<td className="type">조회수</td>
						<td>{notice.views ?? 0}</td>
					</tr>
					<tr className="content--container">
						<td className="type">내용</td>
						<td>
							{/* 백엔드에서 \r\n -> <br> 변환했으므로 그대로 렌더 */}
							<div
								dangerouslySetInnerHTML={{
									__html: notice.content || '',
								}}
							/>
						</td>
					</tr>
				</tbody>
			</table>

			<div className="select--button" style={{ display: 'flex', gap: 8, marginTop: 12 }}>
				<button className="button" onClick={() => navigate('/notice')}>
					목록
				</button>

				{userRole === 'staff' && (
					<>
						<button className="button" onClick={() => navigate(`/notice/update/${id}`)}>
							수정
						</button>
						<button className="button" onClick={handleDelete}>
							삭제
						</button>
					</>
				)}
			</div>
		</div>
	);
};

export default NoticeDetail;
