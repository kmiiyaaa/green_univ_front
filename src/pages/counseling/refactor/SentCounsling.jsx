import { useContext, useEffect, useMemo, useState } from 'react';
import { TABLE_CONFIG } from './TableConfig';
import DataTable from '../../../components/table/DataTable';
import { UserContext } from '../../../context/UserContext';

export default function SentCounseling({ sentList }) {
	const { userRole } = useContext(UserContext);
	const [tableKey, setTablekey] = useState(null);

	useEffect(() => {
		setTablekey(userRole === 'professor' ? 'PROFESSOR_SENT' : 'STUDENT_SENT');
	}, [userRole]);

	const config = TABLE_CONFIG[tableKey];

	if (!config) return null;

	const handlers = {
		detail: (r) => <button>상세</button>,
		decision: (r, id) => <button>처리</button>,
		cancel: (id) => <button>취소</button>,
	};

	const rows = sentList.map((r) => config.data(r, handlers, r.id));

	return (
		<div>
			요청한 상담 목록
			<DataTable headers={config.headers} data={rows} />
		</div>
	);
}
