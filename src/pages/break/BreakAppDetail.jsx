import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import api from '../../api/httpClient';

export default function BreakAppDetail() {
	const { id } = useParams(); // /break/detail/:id 에서 id 가져오기
	const navigate = useNavigate();
	const { userRole } = useContext(UserContext);

	const [breakApp, setBreakApp] = useState(null);
	const [student, setStudent] = useState(null);
	const [deptName, setDeptName] = useState('');
	const [collName, setCollName] = useState('');
	const [loading, setLoading] = useState(true);

	// 휴학신청서 상세 불러오기
	const loadBreakAppDetail = async () => {
		try {
			const res = await api.get(`/api/break/detail/${id}`);
			setBreakApp(res.data.breakApp);
			setStudent(res.data.student);
			setDeptName(res.data.deptName);
			setCollName(res.data.collName);
		} catch (e) {
			console.error(e);
			alert('휴학 신청 정보를 불러오지 못했습니다.');
			navigate(-1, { replace: true });
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadBreakAppDetail();
	}, [id]);

	// 학생용 : 신청 취소
	const handleDelete = async () => {
		if (!window.confirm('신청을 취소하시겠습니까?')) return;

		try {
			await api.post(`/api/break/delete/${id}`);
			alert('휴학 신청이 취소되었습니다.');
			navigate('/break/list'); // 학생용 목록 라우트에 맞게 수정
		} catch (e) {
			console.error(e);
			alert('취소 처리 중 오류가 발생했습니다.');
		}
	};

	// 교직원용 : 신청 승인/반려
	const handleUpdate = async (status) => {
		if (!window.confirm(`해당 신청을 ${status} 하시겠습니까?`)) return;

		try {
			await api.post(`/api/break/update/${id}`, null, {
				params: { status }, // 컨트롤러 String status
			});
			alert(`휴학 신청이 ${status} 처리되었습니다.`);
			navigate('/break/list/staff'); // 교직원용 목록 라우트에 맞게 수정
		} catch (e) {
			console.error(e);
			alert('처리 중 오류가 발생했습니다.');
		}
	};

	if (loading) return <p>불러오는 중...</p>;
	if (!breakApp || !student) return <p>데이터가 없습니다.</p>;

	return (
		<div>
			<h1>휴학 내역 조회</h1>
			<div className="split--div"></div>

			<div className="d-flex flex-column align-items-center" style={{ width: '100%' }}>
				<div className="document--layout">
					<h3>휴학 신청서</h3>
					<table border="1">
						<tbody>
							<tr>
								<th>단 과 대</th>
								<td>{collName}</td>
								<th>학 과</th>
								<td>{deptName}</td>
							</tr>
							<tr>
								<th>학 번</th>
								<td>{student.id}</td>
								<th>학 년</th>
								<td>{breakApp.studentGrade}학년</td>
							</tr>
							<tr>
								<th>전 화 번 호</th>
								<td>{student.tel}</td>
								<th>성 명</th>
								<td>{student.name}</td>
							</tr>
							<tr>
								<th>주 소</th>
								<td colSpan={3}>{student.address}</td>
							</tr>
							<tr>
								<th>기 간</th>
								<td colSpan={3}>
									{breakApp.fromYear}년도 {breakApp.fromSemester}학기부터&nbsp;
									{breakApp.toYear}년도 {breakApp.toSemester}학기까지
								</td>
							</tr>
							<tr>
								<th>휴 학 구 분</th>
								<td colSpan={3}>{breakApp.type}휴학</td>
							</tr>
							<tr>
								<td colSpan={4}>
									<p>위와 같이 휴학하고자 하오니 허가하여 주시기 바랍니다.</p>
									<br />
									<p>{breakApp.appDate}</p>
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				{/* breakApp.status가 "처리중"일 때만 버튼 노출 */}
				{breakApp.status === '처리중' && (
					<>
						{/* 학생 : 취소 버튼 */}
						{userRole === 'student' && (
							<div className="d-flex flex-column align-items-center">
								<button type="button" className="btn btn-dark" onClick={handleDelete}>
									취소하기
								</button>
							</div>
						)}

						{/* 교직원 : 승인/반려 버튼 */}
						{userRole === 'staff' && (
							<div className="d-flex jusitify-contents-center">
								<button type="button" className="btn btn-dark" onClick={() => handleUpdate('승인')}>
									승인하기
								</button>
								&nbsp;&nbsp;&nbsp;
								<button type="button" className="btn btn-dark" onClick={() => handleUpdate('반려')}>
									반려하기
								</button>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
}
