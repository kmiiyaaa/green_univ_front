import { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/httpClient';
import { UserContext } from '../../context/UserContext';

const ScheduleDetail = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { userRole } = useContext(UserContext);

	const [schedule, setSchedule] = useState(null);

	const loadSchedule = async () => {
		try {
			const res = await api.get(`/schedule/detail/${id}`);
			setSchedule(res.data.schedule);
		} catch (e) {
			console.error('학사 일정 상세 로드 실패:', e);
		}
	};

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		loadSchedule();
	}, [id]);

	// 학사일정 삭제
	const handleDelete = async () => {
		if (!window.confirm('정말 삭제할까요?')) return;
		try {
			await api.delete(`/schedule/delete/${id}`);
			alert('삭제 완료');
			navigate('/schedule/list');
		} catch (e) {
			console.error(e);
			alert('삭제 실패');
		}
	};

	if (!schedule) return <div className="form-container schedule-page">로딩중...</div>;

	return (
		<div className="form-container schedule-page schedule-detail">
			<h3>학사 일정 상세</h3>
			<div className="split--div"></div>

			<table className="table schedule-detail-table">
				<tbody>
					<tr>
						<td className="type">시작 날짜</td>
						<td>{schedule.startDay ?? ''}</td>
					</tr>
					<tr>
						<td className="type">종료 날짜</td>
						<td>{schedule.endDay ?? ''}</td>
					</tr>
					<tr className="schedule-detail-content-row">
						<td className="type">내용</td>
						<td>{schedule.information ?? ''}</td>
					</tr>
				</tbody>
			</table>

			<div className="select--button schedule-detail-actions">
				<button className="button" onClick={() => navigate('/schedule')}>
					목록
				</button>

				{userRole === 'staff' && (
					<>
						<button className="button" onClick={() => navigate(`/schedule/update/${id}`)}>
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

export default ScheduleDetail;
