// 교수나 학생이 상담 요청할 때 상담 가능한 날짜를 보여주는 컴포넌트
import { useEffect, useState } from 'react';
import api from '../../api/httpClient';
import { getThisAndNextWeekStartDates } from './../../utils/counselingUtil';
export default function RequestCounseling() {
	const [timelist, setTimelist] = useState([]); // 가능한 상담 날짜 목록
	const [timelist2, setTimelist2] = useState([]); // 가능한 상담 날짜 목록
	const [selectedSubjectId, setSelectedSubjectId] = useState('10030'); // 선택된 과목

	// weekStartDate 계산
	const weekStartDate = getThisAndNextWeekStartDates();
	console.log('weekStartDate', weekStartDate);
	// 임의 과목명 추가
	console.log('selectedSubjectId', selectedSubjectId);

	// 1. 교수가 학생한테 상담 요청 할 때
	const requestToStudent = async () => {
		try {
			const res = await api.get('/counseling/professor', { params: { weekStartDate } });
			setTimelist(res.data);
			console.log('requestToStudent', res.data);
		} catch (e) {
			console.error(e);
		}
	};

	// 2. 학생이 교수한테 상담 요청 할 때
	const requestToProfessor = async () => {
		try {
			const res = await api.get('/counseling/schedule', { params: { subjectId: selectedSubjectId } });
			setTimelist2(res.data.scheduleList);
			console.log('requestToProfessor', res.data.scheduleList);
		} catch (e) {
			console.error(e);
		}
	};

	useEffect(() => {
		requestToStudent();
		requestToProfessor();
	}, []);

	// 2. 학생이 교수한테 상담 요청 할 때

	return (
		<>
			<div>*****************교수가 학생한테 상담 요청 할 때</div>
			{timelist.map((t) => (
				<div key={t.id}>
					<div>{t.counselingDate}</div>
					<div>{t.dayOfWeek}</div>
					<div>
						{t.startTime} ~ {t.endTime}
					</div>
				</div>
			))}
			<div>학생이 교수한테 상담 요청 할 때****************</div>
			{timelist2.map((t) => (
				<div key={t.id}>
					<div>{t.counselingDate}</div>
					<div>{t.dayOfWeek}</div>
					<div>
						{t.startTime} ~ {t.endTime}
					</div>
				</div>
			))}
		</>
	);
}
