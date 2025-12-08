import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/httpClient';
import { UserContext } from '../../context/UserContext';
import ScheduleForm from '../schedule/ScheduleForm';

const ScheduleWrite = () => {
	const navigate = useNavigate();
	const { userRole } = useContext(UserContext);

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

	const handleCreate = async ({ startDay, endDay, information }) => {
		try {
			await api.post('/schedule/write', { startDay, endDay, information });
			alert('학사 일정 등록 완료!');
			navigate('/schedule/list');
		} catch (e) {
			console.error('학사 일정 등록 실패:', e);
			alert('등록 실패');
		}
	};

	return +(
		<div className="form-container schedule-page">
			<h3>학사 일정 등록</h3>
			<div className="split--div"></div>

			<ScheduleForm
				initialValues={{ startDay: '', endDay: '', information: '' }}
				onSubmit={handleCreate}
				onCancel={() => navigate('/schedule/list')}
				submitLabel="등록"
			/>
		</div>
	);
};

export default ScheduleWrite;
