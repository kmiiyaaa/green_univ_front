// [학생 상담 예약 메인 페이지]
// 과목 선택 - 해당 과목의 상담 일정 로드
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../../api/httpClient';
import SubjectSelect from '../SubjectSelect';
import CounselingScheduleDetailPage from './CounselingScheduleDetail';

export default function CounselingReserve() {
	// 수강 중인 과목 목록
	const [subjects, setSubjects] = useState([]);

	// 선택된 과목 ID
	const [selectedSubjectId, setSelectedSubjectId] = useState(null);

	// 선택된 과목의 상담 일정 목록
	const [schedules, setSchedules] = useState([]);

	// 과목명 표시용
	const [subName, setSubName] = useState('');

	const [searchParams] = useSearchParams();

	// 로그인 학생의 수강 과목 조회
	useEffect(() => {
		api.get('/subject/semester').then((res) => {
			setSubjects(res.data.subjectList);
		});
	}, []);

	// 위험 학생 페이지에서 넘어온 subjectId 처리
	useEffect(() => {
		const sid = searchParams.get('subjectId');
		if (sid) setSelectedSubjectId(Number(sid));
	}, [searchParams]);

	// 과목 선택 시 상담 일정 조회
	useEffect(() => {
		if (!selectedSubjectId) return;

		api.get('/counseling/schedule', {
			params: { subjectId: selectedSubjectId },
		}).then((res) => {
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
				onChange={(e) => setSelectedSubjectId(Number(e.target.value))}
			/>

			{/* 과목 선택 시 상담 일정 표시 */}
			{selectedSubjectId && (
				<CounselingScheduleDetailPage
					counselingSchedule={schedules}
					subId={selectedSubjectId}
					subName={subName}
				/>
			)}
		</div>
	);
}
