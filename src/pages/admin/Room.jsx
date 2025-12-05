import { useEffect, useState } from 'react';
import api from '../../api/httpClient';
import InputForm from '../../components/form/InputForm';
import DataTable from '../../components/table/DataTable';

const Room = () => {
	// 강의실 전용 상태 관리
	const [roomData, setRoomData] = useState({
		id: '', // 강의실 호수 (예: "101호")
		collegeId: '', // 단과대 ID
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setRoomData({ ...roomData, [name]: value });
	};

	const handleSubmit = async () => {
		try {
			const res = await api.post('/admin/room', roomData);
			console.log('강의실 등록 성공:', res.data);
			alert('강의실 등록 완료!');
		} catch (e) {
			console.error('강의실 등록 실패:', e);
		}
	};

	// 강의실 목록 가져오기
	const [roomList, setRoomList] = useState([]);

	useEffect(() => {
		const loadRoom = async () => {
			try {
				const res = await api.get('/admin/room');
				// console.log(res.data);
				const rawData = res.data.roomList;
				console.log(rawData);
				const formattedData = rawData.map((room) => ({
					id: room.id,
					강의실: room.id,
					단과대: room.college.name,
					단과대아이디: room.college.id,
					원본데이터: room,
				}));

				setRoomList(formattedData);
				console.log('가공된 데이터:', formattedData);
			} catch (e) {
				console.error('강의실 목록 로드 실패:', e);
			}
		};
		loadRoom();
	}, []);

	const headers = ['강의실', '단과대', '단과대아이디'];

	return (
		<div className="form-container">
			<h3>강의실 등록</h3>
			<div className="room--form">
				<InputForm label="강의실 호수" name="id" placeholder="예: 101" value={roomData.id} onChange={handleChange} />
				<InputForm
					label="단과대 ID"
					name="collegeId"
					placeholder="숫자 입력"
					value={roomData.collegeId}
					onChange={handleChange}
				/>

				<button onClick={handleSubmit} className="button">
					강의실 등록
				</button>
			</div>

			<h3>강의실 목록</h3>
			<div>
				<DataTable
					headers={headers}
					data={roomList}
					onRowClick={(row) => {
						// row에는 위에서 가공한 한글 키들이 들어있음
						console.log('클릭한 강의실:', row.강의실);
						// 상세페이지 이동 시 row.id나 row.원본데이터 사용 가능
					}}
				/>
			</div>
		</div>
	);
};
export default Room;
