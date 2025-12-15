import '../assets/css/CounselingEntry.css';
import { useNavigate } from 'react-router-dom';

export default function CounselingEntry() {
	const navigate = useNavigate();

	return (
		<div className="entry-container">
			<h2>상담 서비스</h2>

			<button className="entry-btn professor" onClick={() => navigate('/professor/counseling')}>
				교수 모드
			</button>

			<button className="entry-btn student" onClick={() => navigate('/student/counseling')}>
				학생 모드
			</button>

			<button className="entry-btn video" onClick={() => navigate('/counseling/enter')}>
				화상 상담 방 입장
			</button>
		</div>
	);
}
