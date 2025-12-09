import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import api from '../../api/httpClient';
import DataTable from '../../components/table/DataTable';

// 수강 신청 기간 상태 변경
// 예비 수강신청 기간 : 0, 수강신청 기간 : 1, 수강신청 기간 종료 : 2
export default function UpdatePeriod() {
	const { user, token, userRole } = useContext(UserContext);
	const [sugangState, setSugangState] = useState(null);

	// 현재 상태 불러오기
	const loadSugangState = async () => {
		try {
			const res = await api.get('/sugangperiod');
			console.log('현재 상태:', res.data);
			setSugangState(res.data.status);
		} catch (err) {
			console.error('상태 로드 실패:', err);
		}
	};

	useEffect(() => {
		loadSugangState();
	}, []);

	// 🔥 상태 변경 함수 (0→1일 때만 배치 호출)
	const changeStatus = async (newStatus) => {
		try {
			// 1. 상태 변경
			await api.put('/sugangperiod/update', { status: newStatus });

			// 2. 예비→수강(0→1) 전환일 경우 배치 실행
			if (sugangState === 0 && newStatus === 1) {
				console.log('🔥 배치 실행 중...');
				// StuSubService.movePreToStuSubBatch() 호출용 엔드포인트 필요
				// 방법 1: SugangPeriodService에서 배치 호출하게 수정
				// 방법 2: 별도 엔드포인트 추가 (추천)
				await api.post('/sugang/batch/move-pre-to-regular');
			}

			alert('수강신청 기간이 변경되었습니다!');
			loadSugangState();
		} catch (err) {
			console.error('상태 변경 실패:', err);
			alert('변경에 실패했습니다.');
		}
	};

	return (
		<>
			<h3>수강 신청 기간 설정</h3>

			<div>
				<span>현재 예비 수강 신청 기간입니다.</span>
				<button onClick={() => changeStatus(1)} disabled={sugangState === 1}>
					예비 수강 신청 종료, 수강 신청 기간 시작
				</button>
			</div>

			<div>
				<span>현재 수강 신청 기간입니다.</span>
				<button onClick={() => changeStatus(2)} disabled={sugangState === 2}>
					수강 신청 기간 종료
				</button>
			</div>

			<div>
				<span>이번 학기 수강 신청 기간이 종료되었습니다.</span>
				<button onClick={() => changeStatus(0)} disabled={sugangState === 0}>
					다시 예비 기간으로 초기화
				</button>
			</div>

			<p style={{ marginTop: '20px', fontWeight: 'bold' }}>
				현재 상태: {sugangState === 0 ? '예비' : sugangState === 1 ? '진행중' : '종료'}
			</p>
		</>
	);
}
