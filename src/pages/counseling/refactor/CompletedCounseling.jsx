import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../context/UserContext';
import { TABLE_CONFIG } from './TableConfig';
import DataTable from '../../../components/table/DataTable';

export default function CompletedCounseling({ finishedList }) {
	const { userRole } = useContext(UserContext);
	const [tableKey, setTablekey] = useState(null);

	useEffect(() => {
		setTablekey(userRole === 'professor' ? 'PROFESSOR_FINISHED' : 'STUDENT_FINISHED');
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
					window.open('/counseling/info', '_blank', 'width=900,height=800,scrollbars=yes');
				}}
			>
				보기
			</button>
		),
	};

	const rows = finishedList.map((r) => config.data(r, handlers, r.id));

	return (
		<div>
			완료된 상담 목록 - complete
			{finishedList.length > 0 ? (
				<DataTable headers={config.headers} data={rows} handlers={handlers} />
			) : (
				<div>완료된 상담 목록이 없습니다.</div>
			)}
		</div>
	);
}
