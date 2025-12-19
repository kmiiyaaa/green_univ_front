import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../../api/httpClient';
import SubjectSelect from '../SubjectSelect';
import CounselingScheduleDetailPage from './CounselingReserveDetail';

export default function CounselingReserve() {
	const [subjects, setSubjects] = useState([]);
	const [selectedSubjectId, setSelectedSubjectId] = useState(null);
	const [schedules, setSchedules] = useState([]);
	const [subName, setSubName] = useState('');
	const [searchParams] = useSearchParams();

	// 로그인 학생의 수강 과목 조회
	useEffect(() => {
		api.get('/subject/semester').then((res) => {
			setSubjects(res.data.subjectList);
		});
	}, []);

	// 위험 학생 페이지에서 넘어온 subjectId
	useEffect(() => {
		const sid = searchParams.get('subjectId');
		if (sid) setSelectedSubjectId(sid);
	}, [searchParams]);

	// 과목 선택 시 상담 일정 조회
	useEffect(() => {
		if (!selectedSubjectId) return;

		api
			.get('/counseling/schedule', {
				params: { subjectId: selectedSubjectId },
			})
			.then((res) => {
				setSchedules(res.data.scheduleList);
				setSubName(res.data.subjectName);
			});
	}, [selectedSubjectId]);

	return (
		<div>
			<h2>상담 예약</h2>

			{/* 과목 선택 */}
			<SubjectSelect
				subjects={subjects}
				value={selectedSubjectId}
				onChange={(e) => setSelectedSubjectId(e.target.value)}
			/>

			{/* 과목 선택 시 상담 일정 표시 */}
			{selectedSubjectId && (
				<CounselingScheduleDetailPage counselingSchedule={schedules} subId={selectedSubjectId} subName={subName} />
			)}
		</div>
	);
}
