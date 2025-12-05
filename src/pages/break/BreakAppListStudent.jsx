import { useContext, useEffect, useState } from 'react';
import api from '../api/httpClient';
import { UserContext } from '../../context/UserContext';
import { replace, useNavigate } from 'react-router-dom';

export default function BreakAppListStudent() {
	const [breakAppList, setBreakAppList] = useContext([]);
	const navigate = useNavigate();
	const { user, userRole } = useContext(UserContext);

	const loadBreakAppList = async () => {
		try {
			const res = await api.get('/break/list');
			setBreakAppList(res.data.breakAppList || []);
		} catch (e) {
			console.error(e);
		}
	};

	useEffect(() => {
		if (!user || userRole !== 'student') {
			alert('권한이 없는 페이지 입니다.');
			navigate(-1, { replace: true });
		}
		loadBreakAppList();
	}, [navigate]);

	return (
		<div>
			<h1>휴학 내역 조회</h1>
			<div>
				{breakAppList.length > 0 ? (
					<table border="1" class="list--table">
						<thead>
							<tr>
								<th>신청일자</th>
								<th>구분</th>
								<th>시작학기</th>
								<th>종료학기</th>
								<th>신청서 확인</th>
								<th>상태</th>
							</tr>
						</thead>

						<tbody>
							{breakAppList.map((breakApp) => (
								<tr key={breakApp.id}>
									<td>{breakApp.appDate}</td>
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
									<td>
										{breakApp.status === '처리중' && <span>처리중</span>}
										{breakApp.status === '승인' && <span>승인</span>}
										{breakApp.status === '반려' && <span>반려</span>}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				) : (
					<p>휴학 신청 내역이 없습니다.</p>
				)}
			</div>
		</div>
	);
}
