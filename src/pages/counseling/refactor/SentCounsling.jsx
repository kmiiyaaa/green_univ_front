import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { TABLE_CONFIG } from './TableConfig';
import DataTable from '../../../components/table/DataTable';
import { UserContext } from '../../../context/UserContext';
import api from '../../../api/httpClient';

export default function SentCounseling({ sentList }) {
	const { userRole } = useContext(UserContext);
	const [tableKey, setTablekey] = useState(null);

	// ============== 필요한 함수들 ==============

	// 학생: 확정(APPROVED) 상담 취소
	const cancelMyApproved = useCallback(async (reserveId) => {
		if (!window.confirm('확정된 상담을 취소하시겠습니까?\n취소 후 해당 시간은 다시 예약 가능해집니다.')) return;

		try {
			await api.delete('/reserve/cancel/student', { params: { reserveId } });
		} catch (e) {
			alert(e?.response?.data?.message ?? '취소 실패');
			console.error(e);
		}
	}, []);

	const acceptPre = async (preReserveId) => {
		try {
			await api.post('/reserve/pre/accept', null, { params: { preReserveId } });
			alert('상담 요청을 수락했습니다.');
			await loadMyPreReserves();
			await fetchMyReserveList(); // 수락하면 reserve가 APPROVED로 바뀌니까 목록 갱신

			// 수락으로 schedule.reserved=true 됐을 수 있으니 일정도 갱신
			if (selectedSubjectId) await fetchCounselingSchedules(selectedSubjectId);
		} catch (e) {
			alert(e?.response?.data?.message ?? '수락 실패');
			console.error(e);
		}
	};

	// 교수의 상담요청 거절
	const rejectPre = async (preReserveId) => {
		try {
			await api.post('/reserve/pre/reject', null, { params: { preReserveId } });
			alert('상담 요청을 거절했습니다.');
			await loadMyPreReserves();
			await fetchMyReserveList(); // 거절 후에도 상태 반영
		} catch (e) {
			alert(e?.response?.data?.message ?? '거절 실패');
			console.error(e);
		}
	};

	// ==========================================

	useEffect(() => {
		setTablekey(userRole === 'professor' ? 'PROFESSOR_SENT' : 'STUDENT_SENT');
	}, [userRole]);

	const config = TABLE_CONFIG[tableKey];

	if (!config) return null;

	// const handlers = {
	// 	detail: (r) => <button>상세</button>,
	// 	decision: (r, id) => <button>처리</button>,
	// 	cancel: (id) => <button onClick={() => cancelMyApproved(id)}>취소</button>,
	// };

	const rows = sentList.map((r) => config.data(r, r.id));

	return (
		<div>
			내가 요청한 상담 목록
			{sentList.length > 0 ? (
				<DataTable headers={config.headers} data={rows} />
			) : (
				<div>요청한 상담 목록이 없습니다.</div>
			)}
		</div>
	);
}
