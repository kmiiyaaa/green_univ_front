import { useEffect, useState } from 'react';
import api from '../api/httpClient';
import { UserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';

export default function BreakAppListStaff() {
	const [breakAppList, setBreakAppList] = useState([]);
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();
	const { user, userRole } = useContext(UserContext); // userContext 사용

	const loadBreakAppList = async () => {
		try {
			const res = await api.get('/break/list/staff');
			setBreakAppList(res.data.breakAppList || []);
		} catch (e) {
			console.error(e);
		}
	};

	useEffect(() => {
		//권한 체크
		if (!user || userRole !== 'staff') {
			alert('권한이 없는 페이지 입니다.');
			navigate(-1 / { replace: true });
		}

		loadBreakAppList();
	}, [user, userRole, navigate]);

	if (loading) return <p>불러오는중 ...</p>;

	return (
		<div>
			<h1>휴학 처리</h1>
			<div class="split--div"></div>

			{breakAppList.length > 0 ? (
				<div class="d-flex flex-column align-items-center">
					<table border="1" class="list--table">
						<thead>
							<tr>
								<th>신청일자</th>
								<th>신청자 학번</th>
								<th>구분</th>
								<th>시작학기</th>
								<th>종료학기</th>
								<th>신청서 확인</th>
							</tr>
						</thead>

						<tbody>
							{breakAppList.map((breakApp) => (
								<tr key={breakApp.id}>
									<td>{breakApp.appDate}</td>
									<td>{breakApp.studentId}</td>
									<td>{breakApp.type}휴학</td>
									<td>
										{breakApp.fromYear}년도&nbsp;{breakApp.fromSemester}학기
									</td>
									<td>
										{breakApp.toYear}년도&nbsp;{breakApp.toSemester}학기
									</td>
									<td>
										<button type="button" onClick={() => navigate(`/break/detail/${breakApp.id}`)}>
											Click
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			) : (
				<p>대기중인 신청 내역이 없습니다.</p>
			)}
		</div>
	);
}
