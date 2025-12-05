import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/httpClient';

export default function BreakAppApplication() {
	const navigate = useNavigate();

	const [student, setStudent] = useState(null);
	const [deptName, setDeptName] = useState('');
	const [collName, setCollName] = useState('');

	const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
	const [currentSemester, setCurrentSemester] = useState(1); // 기본값 -> 1학기
	const [toYear, setToYear] = useState(String(new Date().getFullYear()));
	const [toSemester, setToSemester] = useState('2');

	const [type, setType] = useState('일반');

	// 오늘 날짜 문자열 (YYYY년 MM월 DD일) -> 하단에 날짜 불러옴
	const today = new Date();
	const todayStr = `${today.getFullYear()}년 ${String(today.getMonth() + 1).padStart(2, '0')}월 ${String(
		today.getDate()
	).padStart(2, '0')}일`;

	// 신청 화면 데이터 불러오기 (학생/학과/단과대)
	useEffect(() => {
		const loadApplicationData = async () => {
			try {
				const res = await api.get('/api/break/application');

				setStudent(res.data.student);
				setDeptName(res.data.deptName);
				setCollName(res.data.collName);

				// 백엔드에서 currentYear/currentSemester 내려줌
				const serverYear = res.data.currentYear;
				const serverSemester = res.data.currentSemester;

				// 서버 값이 있으면 서버 값 사용, 없으면 기본값 사용
				const finalYear = serverYear ?? new Date().getFullYear();
				const finalSemester = serverSemester ?? 1;

				setCurrentYear(finalYear);
				setCurrentSemester(finalSemester);
				setToYear(String(finalYear));
			} catch (e) {
				console.error(e);
				alert(e.response?.data?.message ?? '휴학 신청 정보를 불러오지 못했습니다.');
				navigate(-1, { replace: true });
			}
		};
		loadApplicationData();
	}, [navigate]);

	const yearOptions = [currentYear, currentYear + 1, currentYear + 2];

	// 휴학 신청
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!window.confirm('휴학을 신청하시겠습니까?')) return;

		try {
			await api.post('/api/break/application', {
				type, // 휴학 구분
				toYear: Number(toYear), // 종료 연도
				toSemester: Number(toSemester), // 종료 학기
				studentGrade: student.grade, // hidden으로 보내던 값
			});

			alert('휴학 신청이 정상적으로 처리되었습니다.');
			navigate('/break/list'); // 학생용 신청 내역 이동
		} catch (e) {
			console.error(e);
			alert(e.response?.data?.message ?? '휴학 신청 처리 중 오류가 발생했습니다.');
		}
	};

	if (!student) return <p>학생 정보를 불러오지 못했습니다.</p>;

	return (
		<div>
			<main>
				<h1>휴학 신청</h1>
				<div className="split--div"></div>

				<div className="d-flex flex-column align-items-center">
					<form onSubmit={handleSubmit} className="d-flex flex-column align-items-center">
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
										<td>{student.grade}학년</td>
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
											{currentYear}년도 {currentSemester}학기부터&nbsp;
											<select name="toYear" value={toYear} onChange={(e) => setToYear(e.target.value)}>
												{yearOptions.map((y) => (
													<option key={y} value={y}>
														{y}
													</option>
												))}
											</select>
											년도
											<select name="toSemester" value={toSemester} onChange={(e) => setToSemester(e.target.value)}>
												<option value="1">1</option>
												<option value="2">2</option>
											</select>
											학기까지
										</td>
									</tr>
									<tr>
										<th>휴 학 구 분</th>
										<td colSpan={3}>
											<input
												type="radio"
												name="type"
												id="일반"
												value="일반"
												checked={type === '일반'}
												onChange={(e) => setType(e.target.value)}
											/>
											<label htmlFor="일반" style={{ margin: 0 }}>
												일반휴학
											</label>
											&nbsp;
											<input
												type="radio"
												name="type"
												id="임신"
												value="임신·출산·육아"
												checked={type === '임신·출산·육아'}
												onChange={(e) => setType(e.target.value)}
											/>
											<label htmlFor="임신" style={{ margin: 0 }}>
												임신·출산·육아휴학
											</label>
											&nbsp;
											<input
												type="radio"
												name="type"
												id="질병"
												value="질병"
												checked={type === '질병'}
												onChange={(e) => setType(e.target.value)}
											/>
											<label htmlFor="질병" style={{ margin: 0 }}>
												질병휴학
											</label>
											&nbsp;
											<input
												type="radio"
												name="type"
												id="창업"
												value="창업"
												checked={type === '창업'}
												onChange={(e) => setType(e.target.value)}
											/>
											<label htmlFor="창업" style={{ margin: 0 }}>
												창업휴학
											</label>
											&nbsp;
											<input
												type="radio"
												name="type"
												id="군입대"
												value="군입대"
												checked={type === '군입대'}
												onChange={(e) => setType(e.target.value)}
											/>
											<label htmlFor="군입대" style={{ margin: 0 }}>
												군입대휴학
											</label>
										</td>
									</tr>
									<tr>
										<td colSpan={4}>
											<p>위와 같이 휴학하고자 하오니 허가하여 주시기 바랍니다.</p>
											<br />
											<p>{todayStr}</p>
										</td>
									</tr>
								</tbody>
							</table>
						</div>

						<button type="submit" className="btn btn-dark">
							신청하기
						</button>
					</form>
				</div>
			</main>
		</div>
	);
}
