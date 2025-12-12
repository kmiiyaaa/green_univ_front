export default function UserInfoTable({ userInfo }) {
	// 내 정보 조회 - 공통 목록만 빼둔 컴포넌트
	return (
		<div>
			<table>
				<tbody>
					<tr>
						<th>성명</th>
						<td>{userInfo?.name}</td>
						<th>생년월일</th>
						<td>{userInfo?.birthDate}</td>
					</tr>

					<tr>
						<th>성별</th>
						<td>{userInfo?.gender}</td>
						<th>주소</th>
						<td>{userInfo?.address}</td>
					</tr>

					<tr>
						<th>연락처</th>
						<td>{userInfo?.tel}</td>
						<th>email</th>
						<td>{userInfo?.email}</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}
