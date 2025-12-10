import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import api from '../../api/httpClient';
import TimetableTable from '../../components/table/TimetableTable';

// 더미 데이터 넣어서 대충 구현만 했음
export default function Timetable() {
	const { user, token, userRole } = useContext(UserContext);

	const mockCourses = [
		{ id: 1, day: '월', start: 9, end: 12, name: '재무설계계획', room: '9-602', color: 'yellow' },
		{ id: 2, day: '화', start: 12, end: 15, name: '블록코딩과 AI기초', room: '5남240', color: 'blue' },
		{ id: 3, day: '화', start: 15, end: 17, name: '소비자상담', room: '9-504', color: 'green' },
		{ id: 4, day: '목', start: 13, end: 15, name: '문제해결 글쓰기', room: '60주년-227', color: 'red' },
	];

	return (
		<div style={{ padding: 24, background: '#f3f4f6', minHeight: '100vh' }}>
			<TimetableTable year={2025} term="1학기" courses={mockCourses} />
		</div>
	);
}
