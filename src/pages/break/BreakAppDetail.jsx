import { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/httpClient';
import { UserContext } from '../../context/UserContext';

import DataTable from '../../components/table/DataTable';
import '../../assets/css/BreakAppDetail.css';

export default function BreakAppDetail() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { userRole } = useContext(UserContext);

	const [breakApp, setBreakApp] = useState(null);
	const [student, setStudent] = useState(null);
	const [deptName, setDeptName] = useState('');
	const [collName, setCollName] = useState('');
	const [loading, setLoading] = useState(true);

	const loadBreakAppDetail = async () => {
		try {
			const res = await api.get(`/break/detail/${id}`);
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	// 상단 요약 DataTable
	const infoHeaders = useMemo(() => ['항목', '내용'], []);
	const infoData = useMemo(() => {
		if (!breakApp || !student) return [];
		return [
			{ 항목: '단과대', 내용: collName },
			{ 항목: '학과', 내용: deptName },
			{ 항목: '학번', 내용: student.id },
			{ 항목: '학년', 내용: `${breakApp.studentGrade}학년` },
			{ 항목: '성명', 내용: student.name },
			{ 항목: '전화번호', 내용: student.tel },
			{ 항목: '주소', 내용: student.address },
			{ 항목: '상태', 내용: breakApp.status },
		];
	}, [breakApp, student, collName, deptName]);

	// 학생용 : 신청 취소
	const handleDelete = async () => {
		if (!window.confirm('신청을 취소하시겠습니까?')) return;

		try {
			await api.post(`/break/delete/${id}`);
			alert('휴학 신청이 취소되었습니다.');
			navigate('/break/list');
		} catch (e) {
			console.error(e);
			alert('취소 처리 중 오류가 발생했습니다.');
		}
	};

	// 교직원용 : 승인/반려
	const handleUpdate = async (status) => {
		if (!window.confirm(`해당 신청을 ${status} 하시겠습니까?`)) return;

		try {
			await api.post(`/break/update/${id}`, null, { params: { status } });
			alert(`휴학 신청이 ${status} 처리되었습니다.`);
			navigate('/break/list/staff');
		} catch (e) {
			console.error(e);
			alert('처리 중 오류가 발생했습니다.');
		}
	};

	if (loading) return <p>불러오는 중...</p>;
	if (!breakApp || !student) return <p>데이터가 없습니다.</p>;

	return (
		<div className="form-container break-detail">
			<h3>휴학 내역 조회</h3>
			<div className="split--div"></div>

			<div className="d-flex flex-column align-items-center">
				<div className="document--layout">
					<h3>휴학 신청서</h3>

					<DataTable headers={infoHeaders} data={infoData} />

					<table className="break-doc-table">
						<tbody>
							<tr>
								<th>기 간</th>
								<td>
									{breakApp.fromYear}년도 {breakApp.fromSemester}학기부터&nbsp;
									{breakApp.toYear}년도 {breakApp.toSemester}학기까지
								</td>
							</tr>
							<tr>
								<th>휴 학 구 분</th>
								<td>{breakApp.type}휴학</td>
							</tr>
							<tr>
								<td colSpan={2}>
									<p>위와 같이 휴학하고자 하오니 허가하여 주시기 바랍니다.</p>
									<br />
									<p>{breakApp.appDate}</p>
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				{/* 처리중일 때만  */}
				{breakApp.status === '처리중' && (
					<div className="schedule-list-actions">
						{userRole === 'student' && (
							<button type="button" className="btn btn-dark" onClick={handleDelete}>
								취소하기
							</button>
						)}

						{userRole === 'staff' && (
							<div className="d-flex">
								<button type="button" className="btn btn-dark" onClick={() => handleUpdate('승인')}>
									승인하기
								</button>
								<button type="button" className="btn btn-dark" onClick={() => handleUpdate('반려')}>
									반려하기
								</button>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
