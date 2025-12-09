import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import api from '../../api/httpClient';
import DataTable from '../../components/table/DataTable';

// 수강 신청 기간 상태 변경
// 예비 수강신청 기간 : 0, 수강신청 기간 : 1, 수강신청 기간 종료 : 2
export default function UpdatePeriod() {
	const { user, token, userRole } = useContext(UserContext);
	// 현재 상태를 보여주는 ..
	const [sugangState, setSugangState] = useState('');

	// 수강 신청 기간 확인
	useEffect(() => {
		const loadSugangState = async () => {
			try {
				const res = await api.get('/sugang/period');
				console.log('loadSugangState', res.data);
			} catch (err) {}
		};
		loadSugangState();
	}, []);

	// useEffect(() => {
	// 	const loadSubjectList = async () => {
	// 		try {
	// 			const res = await api.post('/sugang/updatePeriod1');
	// 			console.log('업데이트수강신청', res.data);
	// 		} catch (e) {
	// 			console.error('강의 목록 로드 실패:', e);
	// 		}
	// 	};
	// 	loadSubjectList();
	// }, []);

	return (
		<>
			<h3>수강 신청 기간 설정</h3>
			<div>
				<span>현재 예비 수강 신청 기간입니다.</span>
				<button>수강 신청 기간 시작</button>
			</div>
			<div>
				<span>현재 수강 신청 기간입니다.</span>
				<button>수강 신청 기간 종료</button>
			</div>
			<div>
				<span>이번 학기 수강 신청 기간이 종료되었습니다.</span>
				<button>없음</button>
			</div>
		</>
	);
}
