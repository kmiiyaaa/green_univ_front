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
