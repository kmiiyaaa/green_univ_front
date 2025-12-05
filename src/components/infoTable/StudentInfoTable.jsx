import InfoTable from './infoTable';

export default function StudentInfoTable({ userInfo, stustatList }) {
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

			<InfoTable userInfo={userInfo} />

			{stustatList.length > 0 && (
				<div>
					<hr />
					<h3>학적 변동 내역</h3>

					<ul>
						<li>변동 일자</li>
						<li>변동 구분</li>
						<li>세부</li>
						<li>승인 여부</li>
						<li>복학 예정 연도 / 학기</li>
					</ul>

					{stustatList.map((s) => (
						<div key={s.id}>
							{s.fromDate}
							{s.status}
							{s?.detail}
							{s.toYear}
							{s?.toSemester}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
