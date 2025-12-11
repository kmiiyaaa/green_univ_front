import { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/httpClient';
import { UserContext } from '../../context/UserContext';
import '../../assets/css/NoticeDetail.css';

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

	
	// 다운로드(공지ID 기준 API)
	// const handleDownload = () => {
	// 	// api 인스턴스 baseURL이 붙는 구조라면 window.open이 가장 단순
	// 	window.open(`/api/notice/file/download/${id}`, '_blank');
	// };

	const handleDownload = async () => {
  try {
    const res = await api.get(`/notice/file/download/${id}`, {
      responseType: "blob",
	  //blob : 이 응답은 파일이니까 파일로 받으라고 axios에게 알려주는 옵션
    });

    const blob = new Blob([res.data]);
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = notice.file?.originFilename || "download";
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
  } catch (e) {
    console.error("다운로드 실패:", e);
    alert("다운로드 실패");
  }
};

	if (!notice) return <div className="form-container">로딩중...</div>;

	const fileName = notice?.file?.originFilename || '';

	return (
		<div className="form-container notice-detail">
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
						<td>{notice.createdTimeFormatted || ''}</td>
					</tr>
					<tr>
						<td className="type">조회수</td>
						<td>{notice.views ?? 0}</td>
					</tr>
					<tr>
						<td className="type">첨부파일</td>
						<td>
							{notice?.hasFile ? (
							<>
								<span>{notice.file?.originFilename}</span>
								<button className="button" type="button" onClick={handleDownload}>
									다운로드
								</button>

							</>
							) : (
							<span>첨부파일 없음</span>
							)}
						</td>
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

			<div className="select--button">
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
