import { useEffect, useState } from 'react';
import api from '../../api/httpClient';
import TimetableTable from '../../components/table/TimetableTable';

export default function Timetable() {
	const [courses, setCourses] = useState([]);
	const [totalGrades, setTotalGrades] = useState(0);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const palette = ['yellow', 'red', 'blue', 'green', 'orange', 'purple'];
	const pickColor = (id) => palette[Math.abs(Number(id ?? 0)) % palette.length];

	const loadTimetable = async () => {
		setLoading(true);
		setError('');

		try {
			const res = await api.get('/sugang/timetable');
			const list = res.data?.courses ?? [];

			const mapped = list.map((c) => ({
				id: c.subjectId,
				day: c.subDay,
				start: c.startTime,
				end: c.endTime,
				name: c.subjectName,
				room: c.roomId ?? '',
				color: pickColor(c.subjectId),
			}));

			setCourses(mapped);
			setTotalGrades(res.data?.totalGrades ?? 0);
		} catch (e) {
			console.error(e);
			setError(e.response?.data?.message || '시간표 조회 실패');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadTimetable();
	}, []);

	return (
		<div style={{ padding: 24, background: '#f9fcf6ff', minHeight: '100vh' }}>
			{loading && <p>시간표 불러오는 중...</p>}
			{error && <p style={{ color: 'crimson' }}>{error}</p>}

			{!loading && !error && courses.length === 0 && <p>최종 수강 신청 내역이 없습니다.</p>}

			{!loading && !error && courses.length > 0 && (
				<TimetableTable
					title={`최종 수강 신청 시간표 (총 ${totalGrades}학점)`}
					year={2025}
					term="1학기"
					courses={courses}
				/>
			)}
		</div>
	);
}
