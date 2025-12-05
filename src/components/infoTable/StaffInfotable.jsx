import UserInfoTable from './UserInfoTable';

export default function StaffInfoTable({ userInfo }) {
	console.log('userinfo : ' + userInfo);
	return (
		<div>
			<table>
				<tbody>
					<tr>
						<th>ID</th>
						<td>{userInfo?.id}</td>
						<th>입사 날짜</th>
						<td>{userInfo?.hireDate}</td>
					</tr>
				</tbody>
			</table>

			<UserInfoTable userInfo={userInfo} />
		</div>
	);
}
