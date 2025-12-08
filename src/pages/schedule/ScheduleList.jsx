import { useEffect, useState } from 'react';
import api from '../../api/httpClient';
import DataTable from '../../components/table/DataTable';
import { useNavigate } from 'react-router-dom';

const ScheduleList = () => {
	const [scheduleList, setScheduleList] = useState([]);
	const headers = ['ID', '기간', '내용'];

	const navigate = useNavigate();

	const formatRange = (s) => {
		const start = s.startDay ? String(s.startDay) : '';
		const end = s.endDay ? String(s.endDay) : '';
		if (!start && !end) return '';
		if (start && end) return `${start} ~ ${end}`;
		return start || end;
	};

	const loadSchedules = async () => {
		try {
			const res = await api.get('/schedule');
			const raw = res.data.schedules || [];

			const formatted = raw.map((s) => ({
				id: s.id,
				ID: s.id,
				기간: formatRange(s),
				내용: s.information,
				원본데이터: s,
			}));

			setScheduleList(formatted);
		} catch (e) {
			console.error('학사 일정 로드 실패:', e);
		}
	};

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		loadSchedules();
	}, []);

	return (
		<div className="form-container schedule-list">
			<h3>학사 일정</h3>
			<div className="split--div"></div>

			<DataTable
				headers={headers}
				data={scheduleList}
				onRowClick={(row) => {
					//상세 페이지 이동
					const id = row?.id;
					if (id) navigate(`/schedule/detail/${id}`);
				}}
			/>
		</div>
	);
};

export default ScheduleList;
