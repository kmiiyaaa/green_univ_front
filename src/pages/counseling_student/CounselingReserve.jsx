import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../api/httpClient';
import OptionForm from '../../components/form/OptionForm';
import { getMonday, getWeekDates } from '../../utils/DateTimeUtil';
import LoadCounselingSchedule from './LoadCounselingSchedule';

// CSS: 컴포넌트명과 동일하게 유지
import '../../assets/css/CounselingReserve.css';

/**
 * CounselingReserve
 * - 학생 상담 예약 메인 페이지
 * - 과목 선택 → 해당 과목 교수의 상담 가능 일정 조회
 */
export default function CounselingReserve() {
	const [searchParams] = useSearchParams();

	// 이번 학기 수강 과목 목록
	const [subjects, setSubjects] = useState([]);

	// 선택된 과목
	const [selectedSubjectId, setSelectedSubjectId] = useState(null);
	const [selectedSubjectName, setSelectedSubjectName] = useState('');

	// 상담 가능 일정
	const [counselingSchedules, setCounselingSchedules] = useState([]);

	/**
	 * 1. 초기 로드
	 * - 학생 기준 이번 학기 수강 과목 조회
	 */
	useEffect(() => {
		const fetchSubjects = async () => {
			const res = await api.get('/subject/semester');
			setSubjects(res.data.subjectList);
		};
		fetchSubjects();
	}, []);

	/**
	 * 2. 성적 페이지에서 넘어온 경우
	 * - subjectId 파라미터 자동 세팅
	 */
	useEffect(() => {
		const paramSubjectId = searchParams.get('subjectId');
		if (paramSubjectId) {
			setSelectedSubjectId(Number(paramSubjectId));
		}
	}, [searchParams]);

	/**
	 * 3. 과목 선택 시 상담 일정 조회
	 */
	useEffect(() => {
		if (!selectedSubjectId) return;

		const fetchSchedules = async () => {
			const monday = getMonday();
			const weekDates = getWeekDates(monday);

			const res = await api.get('/preReserve/byProfessorId', {
				params: {
					subId: selectedSubjectId,
					weekStartDate: weekDates[0],
				},
			});

			setCounselingSchedules(res.data.counselingScheduleList);
			setSelectedSubjectName(res.data.subName);
		};

		fetchSchedules();
	}, [selectedSubjectId]);

	/**
	 * OptionForm 전용 옵션
	 */
	const subjectOptions = subjects.map((s) => ({
		value: s.id,
		label: s.name,
	}));

	return (
		<div className="CounselingReserve">
			<h2 className="CounselingReserve-title">상담 예약</h2>

			{/* 과목 선택 영역 */}
			<div className="CounselingReserve-section">
				<OptionForm
					label="수강 과목"
					name="subject"
					value={selectedSubjectId ?? ''}
					onChange={(e) => setSelectedSubjectId(Number(e.target.value))}
					options={subjectOptions}
				/>
			</div>

			{/* 상담 일정 영역 */}
			{selectedSubjectId ? (
				<LoadCounselingSchedule
					counselingSchedule={counselingSchedules}
					subName={selectedSubjectName}
					subId={selectedSubjectId}
				/>
			) : (
				<p className="CounselingReserve-empty">과목을 선택하면 상담 가능한 일정이 표시됩니다.</p>
			)}
		</div>
	);
}
