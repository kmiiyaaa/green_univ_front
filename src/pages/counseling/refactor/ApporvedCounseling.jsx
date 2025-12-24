import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../context/UserContext';
import { TABLE_CONFIG } from './TableConfig';
import DataTable from '../../../components/table/DataTable';
import api from '../../../api/httpClient';
import { CounselingRefreshContext } from './CounselingRefreshContext';

export default function ApprovedCounseling({ approvedList }) {
	const { userRole } = useContext(UserContext);
	const [tableKey, setTablekey] = useState(null);
	const [loadingId, setLoadingId] = useState(null);
	const { refresh } = useContext(CounselingRefreshContext);

	// =================== 필요 함수들 ======================

	// 교수: 확정(APPROVED) 상담 취소
	const cancelApproved = async (reserveId) => {
		if (!window.confirm('확정된 상담을 취소하시겠습니까?')) return;

		try {
			setLoadingId(reserveId);
			if (userRole === 'professor') {
				await api.delete('/reserve/cancel/professor', { params: { reserveId } });
			} else {
				await api.delete('/reserve/cancel/student', { params: { reserveId } });
			}
			refresh();
		} catch (e) {
			console.error(e);
			alert(e?.response?.data?.message ?? '취소 실패! 잠시 후 다시 시도해주세요.');
		} finally {
			setLoadingId(null);
		}
	};

	//

	useEffect(() => {
		setTablekey(userRole === 'professor' ? 'PROFESSOR_APPROVED' : 'STUDENT_APPROVED');
	}, [userRole]);

	const config = TABLE_CONFIG[tableKey];

	if (!config) return null;

	const handlers = {
		detail: (
			r // 교수 - 학생 상담 신청서 조회
		) => (
			<button
				type="button"
				className="cm-btn cm-btn--ghost"
				onClick={() => {
					sessionStorage.setItem('counselingDetail', JSON.stringify(r));
					window.open('/counseling/info', '_blank');
				}}
			>
				보기
			</button>
		),
		cancel: (r) => <button onClick={() => cancelApproved(r.id)}>취소</button>,
	};

	const rows = approvedList.map((r) => config.data(r, handlers, r.id));

	return (
		<div>
			확정된 상담 목록 - approve
			{approvedList.length > 0 ? (
				<DataTable headers={config.headers} data={rows} />
			) : (
				<div>확정된 상담 목록이 없습니다.</div>
			)}
		</div>
	);
}
