import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/httpClient';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';

export default function TuiList() {
	// 납부된 등록금 내역을 조회하는 컴포넌트
	const [tuiList, setTuiList] = useState([]);
	const navigate = useNavigate();
	const { user, userRole } = useContext(UserContext);

	useEffect(() => {
		if (user === null) return;
		if (userRole !== 'student') {
			navigate(-1, { replace: true });
			return;
		}

		const loadTuition = async () => {
			// 등록금 불러오기 (tuitionController 58번)
		const loadTuition = async () => {
			// 등록금 불러오기 (tuitionController 58번)

			try {
				const res = await api.get('/tuition/list');
				setTuiList(res.data);
			} catch (e) {
				console.error('tuiList 불러오기 실패' + e);
			}
		};
			try {
				const res = await api.get('/tuition/list');
				setTuiList(res.data);
			} catch (e) {
				console.error('tuiList 불러오기 실패' + e);
			}
		};

		loadTuition();
	}, [user, userRole, navigate]);

	return (
		<div>
			<h2>등록금 내역 조회</h2>
			<hr />

			{tuiList.length > 0 ? (
				<>
					<ul>
						<li>등록연도</li>
						<li>등록학기</li>
						<li>장학금 유형</li>
						<li>등록금</li>
						<li>장학금</li>
						<li>납입금</li>
					</ul>

					{tuiList.map((t) => (
						<div key={t.id}>
							{t.tuiYear + '년'}
							{t.semester + '학기'}
							{t.schType?.name ?? ''}
							{t.tuiAmount} {/*등록 금액 */}
							{t.schAmount} {/* 장학 금액 */}
							{t.payAmount} {/* 납입금 */}
						</div>
					))}
				</>
			) : (
				'등록금 납부 내역이 없습니다!'
			)}
		</div>
	);
}
