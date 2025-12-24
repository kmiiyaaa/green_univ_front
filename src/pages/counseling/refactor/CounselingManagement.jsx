import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../context/UserContext';

export default function CounselingManageMent() {
	const [request, setRequest] = useState([]); // 내가 요청한 상담 목록
	const [response, setResponse] = useState([]); // 요청 받은 상담 목록
	const { userRole } = useContext(UserContext);

	// 사용자 역할에 따라 기능 분리
	// api 호출, 새로고침, 값 내려주기 용도
	// 내 상담관리 (학생, 교수 공통)
	// 상담 요청, 내가 보낸 상담 요청, 확정된 상담, 상담완료 목록 필요
	useEffect(() => {
        
    }, []);

	return <div>// 상담관리 헤더 // 처리할 상담 요청 // 내가 보낸 상담 요청 // 확정된 상담 // 상담 완료</div>;
}
