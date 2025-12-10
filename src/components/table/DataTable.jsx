// DataTable 테이블 컴포넌트
import '../../assets/css/DataTable.css';

const DataTable = ({ headers, data, onRowClick, onCellClick, clickableHeaders = [] }) => {
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
					{data.map((row, rowIdx) => (
						<tr key={rowIdx} onClick={() => onRowClick?.(row)} className={`${onRowClick ? 'rowClick' : ''}`}>
							{headers.map((header) => {
								const isClickable = clickableHeaders.includes(header);

								if (!isClickable) {
									return <td key={header}>{row[header]}</td>;
								}

								return (
									<td key={header}>
										<button
											className="action-btn"
											onClick={(e) => {
												e.stopPropagation(); // 행 클릭 막기
												onCellClick?.({ row, header, rowIdx }); // 필요 정보 외부로 전달
											}}
										>
											{row[header]}
										</button>
									</td>
								);
							})}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default DataTable;
