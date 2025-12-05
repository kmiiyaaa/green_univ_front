// components/feature/RoomForm.jsx
import { useState } from 'react';
import api from '../../api/httpClient';
import InputForm from './../../components/form/InputForm';

const Room2 = () => {
	// 강의실 전용 상태 관리
	const [roomData, setRoomData] = useState({
		id: '', // 강의실 호수 (예: "101호")
		collegeId: '', // 단과대 ID
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setRoomData({ ...roomData, [name]: value });
	};

	const handleRoomSubmit = async () => {
		try {
			const res = await api.post('/admin/room', roomData);
			console.log('강의실 등록 성공:', res.data);
			alert('강의실 등록 완료!');
		} catch (e) {
			console.error('강의실 등록 실패:', e);
		}
	};

	return (
		<div className="form-container">
			<h3>강의실 등록</h3>
			<div className="room--form">
				{/* InputForm 재사용! props만 다르게 주면 됨 */}
				<InputForm label="강의실 호수" name="id" placeholder="예: 101" value={roomData.id} onChange={handleChange} />
				<InputForm
					label="단과대 ID"
					name="collegeId"
					placeholder="숫자 입력"
					value={roomData.collegeId}
					onChange={handleChange}
				/>

				<button onClick={handleRoomSubmit} className="button">
					강의실 등록
				</button>
			</div>
		</div>
	);
};
export default Room2;
