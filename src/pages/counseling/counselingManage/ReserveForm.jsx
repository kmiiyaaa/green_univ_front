import { useCallback, useEffect, useState } from 'react';
import api from '../../../api/httpClient';
import SubjectSelect from '../SubjectSelect';
import SelectDateForCounseling from '../SelectDateForCounseling';

// 상담 예약 폼 컴포넌트
export default function ReserveForm({ paramId }) {
	const [subjects, setSubjects] = useState([]);
	const [selectedSubjectId, setSelectedSubjectId] = useState('');

	const [selectedSlot, setSelectedSlot] = useState(null);
	const [reason, setReason] = useState('');
	const [loading, setLoading] = useState(false);

	// 학생 수강 과목 조회
	const fetchSubjectsThisSemester = useCallback(async () => {
		const res = await api.get('/subject/semester');
		setSubjects(res.data?.subjectList ?? []);
	}, []);

	useEffect(() => {
		fetchSubjectsThisSemester();
	}, [fetchSubjectsThisSemester]);

	useEffect(() => {
		if (paramId) setSelectedSubjectId(paramId);
	}, [paramId]);

	// 과목 바뀌면 선택/메시지 초기화
	useEffect(() => {
		setSelectedSlot(null);
		setReason('');
	}, [selectedSubjectId]);

	const submit = async () => {
		if (!selectedSubjectId || !selectedSlot?.id) return;

		try {
			setLoading(true);
			await api.post('/reserve', {
				subjectId: Number(selectedSubjectId),
				counselingScheduleId: Number(selectedSlot.id),
				reason: reason || '',
			});

			alert('상담 요청을 보냈습니다.');
			setSelectedSlot(null);
			setReason('');
		} catch (e) {
			console.error(e);
			alert(e?.response?.data?.message ?? '상담 요청 실패');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="reserve-schedule">
			{/* 과목 선택 */}
			<SubjectSelect
				subjects={subjects}
				value={selectedSubjectId}
				onChange={(e) => setSelectedSubjectId(e.target.value)}
			/>

			{/* 과목 선택 시 상담 일정 표시 */}
			{selectedSubjectId && (
				<>
					<SelectDateForCounseling mode="student" subjectId={selectedSubjectId} onSelectSlot={setSelectedSlot} />

					<textarea
						value={reason}
						onChange={(e) => setReason(e.target.value)}
						placeholder="예) 성적 관련 상담이 필요합니다."
					/>

					<button type="button" onClick={submit} disabled={!selectedSlot?.id || loading} style={{ marginTop: 10 }}>
						상담 요청
					</button>
				</>
			)}
		</div>
	);
}
