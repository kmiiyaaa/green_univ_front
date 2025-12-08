import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/httpClient';
import { UserContext } from '../../context/UserContext';
import ScheduleForm from '../schedule/ScheduleForm';

const ScheduleUpdate = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { userRole } = useContext(UserContext);

	const [initialValues, setInitialValues] = useState(null);

	if (userRole !== 'staff') {
		return (
			<div className="form-container schedule-page">
				권한이 없습니다.
				<button className="button" onClick={() => navigate(-1)}>
					뒤로
				</button>
			</div>
		);
	}

	const loadSchedule = async () => {
		try {
			const res = await api.get(`/schedule/detail/${id}`);
			const s = res.data.schedule;

			setInitialValues({
				startDay: s?.startDay ?? '',
				endDay: s?.endDay ?? '',
				information: s?.information ?? '',
			});
		} catch (e) {
			console.error('학사 일정 수정 로드 실패:', e);
		}
	};

	// eslint-disable-next-line react-hooks/rules-of-hooks
	useEffect(() => {
		loadSchedule();
	}, [id]);

	const handleUpdate = async ({ startDay, endDay, information }) => {
		try {
			await api.patch(`/schedule/update/${id}`, { startDay, endDay, information });
			alert('수정 완료!');
			navigate(`/schedule/detail/${id}`);
		} catch (e) {
			console.error('학사 일정 수정 실패:', e);
			alert('수정 실패');
		}
	};

	if (!initialValues) return <div className="form-container schedule-page">로딩중...</div>;

	return (
		<div className="form-container schedule-page">
			<h3>학사 일정 수정</h3>
			<div className="split--div"></div>

			<ScheduleForm
				initialValues={initialValues}
				onSubmit={handleUpdate}
				onCancel={() => navigate(`/schedule/detail/${id}`)}
				submitLabel="수정"
			/>
		</div>
	);
};

export default ScheduleUpdate;
