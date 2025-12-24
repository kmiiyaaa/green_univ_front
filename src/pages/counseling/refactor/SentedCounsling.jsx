import { useMemo, useState } from 'react';
import { TABLE_CONFIG } from './HeaderConfig';
import DataTable from '../../../components/table/DataTable';

export default function SentedCounseling({ requestedList }) {
	// TABLE_CONFIG에서 필요한 키 가져오기 (예: STUDENT_SEND)
	const tableKey = 'STUDENT_SEND';
	const config = TABLE_CONFIG[tableKey];

	return (
		<div>
			요청한 상담 목록
			{/* <DataTable headers={config.headers} data={data} />
			 */}
		</div>
	);
}
