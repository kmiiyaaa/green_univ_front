export default function InfoTable(data) {
    // 내 정보 조회 - 공통 목록만 빼둔 컴포넌트
	return (
		<div>
			<table>
				<tbody>
					<tr>
						<th>성명</th>
						<td>{data.name}</td>
						<th>생년월일</th>
						<td>{data.birthDate}</td>
					</tr>

					<tr>
						<th>성별</th>
						<td>{data.gender}</td>
						<th>주소</th>
						<td>{data.address}</td>
					</tr>

					<tr>
						<th>연락처</th>
						<td>{data.tel}</td>
						<th>email</th>
						<td>{data.email}</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}
