import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { TABLE_CONFIG } from './TableConfig';
import DataTable from '../../../components/table/DataTable';
import { UserContext } from '../../../context/UserContext';
import api from '../../../api/httpClient';

export default function SentCounseling({ sentList }) {
	const { userRole } = useContext(UserContext);
	const [tableKey, setTablekey] = useState(null);

	useEffect(() => {
		setTablekey(userRole === 'professor' ? 'PROFESSOR_SENT' : 'STUDENT_SENT');
	}, [userRole]);

	const config = TABLE_CONFIG[tableKey];

	if (!config) return null;

	const rows = sentList.map((r) => config.data(r, r.id));

	return (
		<div>
			내가 요청한 상담 목록 - sent
			{sentList.length > 0 ? (
				<DataTable headers={config.headers} data={rows} />
			) : (
				<div>요청한 상담 목록이 없습니다.</div>
			)}
		</div>
	);
}
