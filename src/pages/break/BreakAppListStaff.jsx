import { useEffect, useState } from 'react';
import api from '../api/httpClient';
import { UserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';

export default function BreakAppListStaff() {
	const [breakAppList, setBreakAppList] = useState([]);

	const navigate = useNavigate();
	const { user, userRole, token } = useContext(UserContext); // userContext 사용

	const loadBreakAppList = async () => {
		try {
			await api.get('/break/list/staff');
			setBreakAppList(res.data.breakAppList || []);
		} catch (e) {
			console.error(e);
			setError('휴학 신청을 불러오지 못했습니다.');
		} finally {
			setLoading(false);
		}
	};

	useEffect;
	() => {
		loadBreakAppList();
	},
		[];

	return (
		<div>
			<h1>휴학 처리</h1>
			<div class="split--div"></div>

			<c:choose>
				<c:when test="${breakAppList.size() > 0}">
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
								<c:forEach var="breakApp" items="${breakAppList}">
									<tr>
										<td>${breakApp.appDate}</td>
										<td>${breakApp.studentId}</td>
										<td>${breakApp.type}휴학</td>
										<td>
											${breakApp.fromYear}년도&nbsp;${breakApp.fromSemester}학기
										</td>
										<td>
											${breakApp.toYear}년도&nbsp;${breakApp.toSemester}학기
										</td>
										<td>
											<a href="/break/detail/${breakApp.id}">Click</a>
										</td>
									</tr>
								</c:forEach>
							</tbody>
						</table>
					</div>
				</c:when>

				<c:otherwise>
					<p class="no--list--p">대기 중인 신청 내역이 없습니다.</p>
				</c:otherwise>
			</c:choose>
		</div>
	);
}
