import { useContext, useEffect, useMemo, useState } from 'react';
import { TABLE_CONFIG } from './HeaderConfig';
import DataTable from '../../../components/table/DataTable';
import { UserContext } from '../../../context/UserContext';

export default function SentCounseling({ requestedList }) {
	const { userRole } = useContext(UserContext);
	const [tableKey, setTablekey] = useState(null);

	useEffect(() => {
		if (userRole === 'professor') {
			setTablekey(TABLE_CONFIG.PROFESSOR_SEND);
		} else {
			setTablekey(TABLE_CONFIG.STUDENT_SEND);
		}
	}, []);

	const config = TABLE_CONFIG[tableKey];

	return (
		<div>
			요청한 상담 목록
			{/* <DataTable headers={config.headers} data={data} />
			 */}
		</div>
	);
}
