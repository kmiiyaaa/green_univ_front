// DataTable 테이블 컴포넌트
import '../../assets/css/DataTable.css';

const DataTable = ({ headers, data, onRowClick }) => {
	return (
		<div className="data-table-wrapper">
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
		</div>
	);
};

export default DataTable;
