import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../context/UserContext';
import { TABLE_CONFIG } from './TableConfig';
import DataTable from '../../../components/table/DataTable';

export default function RequsetedCounseling({ requestList }) {
	const { userRole } = useContext(UserContext);
	const [tableKey, setTablekey] = useState(null);

	useEffect(() => {
		setTablekey(userRole === 'professor' ? 'PROFESSOR_REQUESTED' : 'STUDENT_REQUESTED');
	}, [userRole]);

	const config = TABLE_CONFIG[tableKey];

	if (!config) return null;

	const handlers = {
		detail: (r) => <button>상세</button>,
		decision: (r, id) => <button>처리</button>,
		cancel: (id) => <button>취소</button>,
	};

	const rows = requestList.map((r) => config.data(r, handlers, r.id));
	console.log(requestList);
	return (
		<div>
			요청받은 상담 목록
			<DataTable headers={config.headers} data={rows} />
		</div>
	);
}
