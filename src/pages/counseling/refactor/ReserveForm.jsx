import { useCallback, useEffect, useState } from 'react';
import api from '../../../api/httpClient';
import SubjectSelect from '../SubjectSelect';

export default function ReserveForm() {
	const [subjects, setSubjects] = useState([]);
	const [selectedSubjectId, setSelectedSubjectId] = useState('');
	const [schedules, setSchedules] = useState([]);
	const [subName, setSubName] = useState('');

	// 학생 수강 과목 조회
	const fetchSubjectsThisSemester = useCallback(async () => {
		const res = await api.get('/subject/semester');
		setSubjects(res.data?.subjectList ?? []);
	}, []);

	useEffect(() => {
		fetchSubjectsThisSemester();
	}, [fetchSubjectsThisSemester]);

	// 과목 선택 시 상담 일정 조회
	const fetchCounselingSchedules = useCallback(async (subjectId) => {
		const res = await api.get('/counseling/schedule', { params: { subjectId } });
		setSchedules(res.data?.scheduleList ?? []);
		setSubName(res.data?.subjectName ?? '');
	}, []);

	useEffect(() => {
		if (!selectedSubjectId) return;
		fetchCounselingSchedules(selectedSubjectId);
	}, [selectedSubjectId, fetchCounselingSchedules]);


	const fetchMyReserveList = useCallback(async () => {
		const res = await api.get('/reserve/list');
		setList(res.data ?? []);
	}, []);

	return (
		<div>
			예약 폼<h2>상담 예약</h2>
			{/* 과목 선택 */}
			<SubjectSelect
				subjects={subjects}
				value={selectedSubjectId}
				onChange={(e) => setSelectedSubjectId(e.target.value)}
			/>
			{/* 과목 선택 시 상담 일정 표시 */}
			{selectedSubjectId && (
				<div className="reserve-schedule">
					<CounselingScheduleDetailPage
						counselingSchedule={schedules}
						subId={selectedSubjectId}
						subName={subName}
						onReserveSuccess={async () => {
							await fetchMyReserveList(); // 기존: 목록 갱신
							setSelectedSubjectId(''); // 추가: 과목 선택 초기화 → UI 닫힘
						}}
					/>
				</div>
			)}
		</div>
	);
}
