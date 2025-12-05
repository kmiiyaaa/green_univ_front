import InfoTable from "./infoTable";

export default function ProfessorInfoTable({ userInfo }) {
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

			<InfoTable userInfo={userInfo} />
		</div>
	);
}
