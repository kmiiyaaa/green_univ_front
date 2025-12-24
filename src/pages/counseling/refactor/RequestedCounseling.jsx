import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../context/UserContext';
import { TABLE_CONFIG } from './TableConfig';
import DataTable from '../../../components/table/DataTable';
import api from '../../../api/httpClient';
import { listFilter } from './ListFilter';
import { CounselingRefreshContext } from './CounselingRefreshContext';

// 요청 받은 상담 목록 조회
export default function RequestedCounseling({ requestByList }) {
	const { userRole } = useContext(UserContext);
	const [tableKey, setTablekey] = useState(null);
	const [loadingId, setLoadingId] = useState(null);
	const { refresh } = useContext(CounselingRefreshContext);

	const { requestedList } = listFilter(requestByList);

	// ============== 함수 ==============

	const handleDecision = async ({ role, type, id }) => {
		try {
			setLoadingId(id);

			if (role === 'professor') {
				await api.post('/reserve/decision', null, {
					params: { reserveId: id, decision: type },
				});
			} else {
				const url = type === '승인' ? '/reserve/pre/accept' : '/reserve/pre/reject';

				await api.post(url, null, { params: { preReserveId: id } });
			}
			refresh();
		} catch (e) {
			alert(e?.response?.data?.message ?? '처리 실패');
			console.error(e);
		} finally {
			setLoadingId(null);
		}
	};

	useEffect(() => {
		setTablekey(userRole === 'professor' ? 'PROFESSOR_REQUESTED' : 'STUDENT_REQUESTED');
	}, [userRole]);

	const config = TABLE_CONFIG[tableKey];

	if (!config) return null;

	const handlers = {
		detail: (
			r // 교수 - 학생 상담 신청서 조회
		) => (
			<button
				type="button"
				onClick={() => {
					sessionStorage.setItem('counselingDetail', JSON.stringify(r));
					window.open('/counseling/info', '_blank', 'width=900,height=800,scrollbars=yes');
				}}
			>
				보기
			</button>
		),
		decision: (r) => (
			<div>
				<button
					type="button"
					disabled={loadingId === r.id}
					onClick={() =>
						handleDecision({
							role: userRole,
							type: '승인',
							id: r.id,
						})
					}
				>
					승인
				</button>
				<button
					type="button"
					disabled={loadingId === r.id}
					onClick={() =>
						handleDecision({
							role: userRole,
							type: '반려',
							id: r.id,
						})
					}
				>
					반려
				</button>
			</div>
		),

		cancel: (id) => <button>취소</button>,
	};

	const rows = requestedList.map((r) => config.data(r, handlers, r.id));

	return (
		<div>
			요청 받은 상담 목록 - request
			{requestedList?.length > 0 ? (
				<DataTable headers={config.headers} data={rows} />
			) : (
				<div>요청받은 상담 목록이 없습니다.</div>
			)}
		</div>
	);
}
