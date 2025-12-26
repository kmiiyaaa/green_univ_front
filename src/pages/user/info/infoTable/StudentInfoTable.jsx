// import { useEffect, useState } from 'react';
import DataTable from '../../../../components/table/DataTable';
import UserInfoTable from './UserInfoTable';

export default function StudentInfoTable({ userInfo, stustatList }) {
	const header2 = ['변동 일자', '변동 구분', '세부', '승인 여부', '복학 예정 연도', '복학 예정 학기'];

	return (
		<div className="form-container">
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

			<UserInfoTable userInfo={userInfo} />

			{stustatList.length > 0 && (
				<>
					<h3>학적 변동 내역</h3>
					<DataTable headers={header2} data={stustatList} />
				</>
			)}
		</div>
	);
}
