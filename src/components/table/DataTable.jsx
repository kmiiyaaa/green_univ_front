// DataTable.jsx - 헤더랑 데이터만 바꿔서 강의/학생 모두 사용
const DataTable = ({ headers, data, onRowClick }) => {
	return (
		<table className="data-table">
			<thead>
				<tr>
					{headers.map((h) => (
						<th key={h}>{h}</th>
					))}
				</tr>
			</thead>
			<tbody>
				{data.map((row, idx) => (
					<tr key={idx} onClick={() => onRowClick?.(row)}>
						{headers.map((header) => (
							<td key={header}>{row[header]}</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default DataTable;
