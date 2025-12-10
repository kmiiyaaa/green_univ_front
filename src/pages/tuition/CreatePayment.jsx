import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import { Navigate, useNavigate } from 'react-router-dom';
import api from '../../api/httpClient';

export default function CreatePayment() {
	// 관리자 - 등록금 고지서 생성 페이지
	// 기존 tuition/bill(단순 페이지) , tuition/create (고지서 발송 기능)
	const { user, userRole } = useContext(UserContext);
	const [insertCount, setInsertCount] = useState(0);
	const navigate = useNavigate();

	useEffect(() => {
		// 권한 확인 (관리자)
		if (user === null) return;
		if (userRole !== 'staff') {
			navigate(-1, { replace: true });
			return;
		}
	}, [user, userRole, navigate]);

	const submitTuition = async () => {
		try {
			const res = await api.get('/tuition/create');
			console.log(res.data.insertCount);
			setInsertCount(res.data.insertCount);
		} catch (e) {
			console.error('등록금 고지서 생성 실패' + e);
		}
		alert(insertCount + '개의 고지서가 생성되었습니다!');
	};

	return (
		<div>
			<button onClick={() => submitTuition()}>등록금 고지서 발송</button>
		</div>
	);
}
