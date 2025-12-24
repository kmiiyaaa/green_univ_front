import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../context/UserContext';
import { TABLE_CONFIG } from './TableConfig';
import DataTable from '../../../components/table/DataTable';

export default function ApprovedCounseling({ approvedList }) {
	const { userRole } = useContext(UserContext);
	const [tableKey, setTablekey] = useState(null);

	useEffect(() => {
		setTablekey(userRole === 'professor' ? 'PROFESSOR_APPROVED' : 'STUDENT_APPROVED');
	}, [userRole]);

	const config = TABLE_CONFIG[tableKey];

	if (!config) return null;

	const handlers = {
		detail: (r) => <button>상세</button>,
		decision: (r, id) => <button>처리</button>,
		cancel: (id) => <button>취소</button>,
	};

	const rows = approvedList.map((r) => config.data(r, handlers, r.id));

	return (
		<div>
			확정된 상담 목록
			{approvedList.length > 0 ? (
				<DataTable headers={config.headers} data={rows} />
			) : (
				<div>확정된 상담 목록이 없습니다.</div>
			)}
		</div>
	);
}
