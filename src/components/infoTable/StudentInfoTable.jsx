export default function StudentInfoTable({ userInfo }) {
	return (
		<div>
			<table>
				<tbody>
					<tr>
						<th>학번</th>
						<td>{userInfo?.id}</td>
						<th>소속</th>
						<td>
							{userInfo?.collegeName}
							{userInfo?.deptName}
						</td>
					</tr>

					<tr>
						<th>학년</th>
						<td>{userInfo?.grade}</td>
						<th>학기</th>
						<td>{userInfo?.semester}</td>
					</tr>

					<tr>
						<th>입학일</th>
						<td>{userInfo?.entranceDate}</td>
						<th>졸업일(졸업예정일)</th>
						<td>{userInfo?.graduationDate}</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}
