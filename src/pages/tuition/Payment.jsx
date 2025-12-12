import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import api from '../../api/httpClient';
import { comma } from '../../utils/FmtMoney';

export default function Payment() {
	// 등록금 고지서를 조회하는 컴포넌트 tuitionController

	const navigate = useNavigate();
	const { user, userRole } = useContext(UserContext);
	const [student, setStudent] = useState({}); // 학생정보
	const [deptName, setDeftName] = useState(null); // 학과
	const [collName, setCollName] = useState(null); // 단과대
	const [tuition, setTuition] = useState({}); // 등록금

	useEffect(() => {
		// 등록금 고지서 로드 ,유저 확인 useEffect
		if (user === null) return;
		if (userRole !== 'student') {
			navigate(-1, { replace: true });
			return;
		}

		const loadPayment = async () => {
			// 등록금 고지서 불러오기 함수
			try {
				const res = await api.get('/tuition/payment');
				if (res) {
					setStudent(res.data.student);
					setDeftName(res.data.deptName);
					setCollName(res.data.collName);
					setTuition(res.data.tuition);
				}
			} catch (e) {
				console.error('tuition/payment 불러오기 실패' + e);
			}
		};

		loadPayment();

		if (tuition === null) {
			alert('등록금 조회 기간이 아닙니다!');
			navigate(-1, { replace: true });
		}
	}, [user, userRole, navigate]);

	const handlePayment = async () => {
		// 등록금 납부
		try {
			await api.post('/tuition/payment');
			alert('등록금이 성공적으로 납부되었습니다!');
		} catch (e) {
			console.error('등록금 납부 실패' + e);
			alert('등록금 납부에 실패했습니다. 관리자에게 문의해주세요.');
		}
	};

	const test = true;
	return (
		<div>
			<h2>등록금 고지서</h2>
			<hr />

			{tuition !== null && test ? (
				<>
					<div>
						<div>
							{tuition.tuiYear}년도 {tuition.semester}학기
						</div>

						<table>
							<tbody>
								<tr>
									<th>단과대</th>
									<td>{collName}</td>
									<th>학과</th>
									<td>{deptName}</td>
								</tr>

								<tr>
									<th>학번</th>
									<td>{student?.id}</td>
									<th>성명</th>
									<td>{student?.name}</td>
								</tr>

								<tr>
									<th>장학유형</th>
									<td colSpan="3">{tuition?.schType?.type ?? '장학금 지급 대상 아님'}</td>
								</tr>

								{/* 금액 format 필요 */}
								<tr>
									<th>등록금</th>
									<td colSpan="3">{comma(tuition?.schAmount)}</td>
								</tr>

								<tr>
									<th>장학금</th>
									<td colSpan="3">{comma(tuition?.schAmount)}</td>
								</tr>

								<tr>
									<th>납부금</th>
									<td colSpan="3">{comma(tuition?.payAmount)}</td>
								</tr>

								<tr>
									<th>납부계좌</th>
									<td colSpan="3">그린은행 483-531345-536</td>
								</tr>

								<tr>
									<th>납부기간</th>
									{/* 원본도 따로 값을 받아 찍진 않음 */}
									<td colSpan="3">~ 2023.05.02</td>
								</tr>
							</tbody>
						</table>

						{tuition.status === false && <button onClick={() => handlePayment()}>납부하기</button>}
					</div>
				</>
			) : (
				'등록금 고지서 조회 기간이 아닙니다.'
			)}
		</div>
	);
}
