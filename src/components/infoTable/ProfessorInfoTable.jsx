export default function professorInfoTable({ userInfo }) {
	return (
		<div>
			<table>
				<tbody>
					<tr>
						<th>ID</th>
						<td>{userInfo?.id}</td>
						<th>소속</th>
						<td>
							{userInfo?.collegeName}
							{userInfo?.deptName}
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}
