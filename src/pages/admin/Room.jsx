import { useEffect, useState } from 'react';
import api from '../../api/httpClient';
import InputForm from '../../components/form/InputForm';
import DataTable from '../../components/table/DataTable';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export default function Room() {
	const queryClient = useQueryClient();

	// 1. 강의실 목록 가져오기 (useEffect + useState 대체!)
	const { data: roomList = [] } = useQuery({
		queryKey: ['rooms'], // 이 데이터의 고유 이름표
		queryFn: async () => {
			const res = await api.get('/admin/room');
			return res.data.roomList.map((room) => ({
				id: room.id,
				강의실: room.id,
				단과대: room.college.name,
				단과대아이디: room.college.id,
			}));
		},
	});

	/** 강의실 목록 가져오기
	const [roomList, setRoomList] = useState([]);
	useEffect(() => {
		const loadRoom = async () => {
			try {
				const res = await api.get('/admin/room');
				// console.log(res.data);
				const rawData = res.data.roomList;
				//console.log(rawData);
				const formattedData = rawData.map((room) => ({
					id: room.id,
					강의실: room.id,
					단과대: room.college.name,
					단과대아이디: room.college.id,
					원본데이터: room,
				}));

				setRoomList(formattedData);
			} catch (e) {
				console.error('강의실 목록 로드 실패:', e);
			}
		};
		loadRoom();
	}, []);
	*/

	// 2. 강의실 등록하기 (useMutation 사용)
	const createRoomMutation = useMutation({
		mutationFn: (newRoom) => api.post('/admin/room', newRoom),
		onSuccess: () => {
			alert('강의실 등록 완료!');
			// ★ 여기가 핵심! 등록 성공하면 'rooms'란 이름표 가진 목록을 무효화시킴 -> 즉시 다시 가져옴
			queryClient.invalidateQueries({ queryKey: ['rooms'] });
		},
		onError: (err) => {
			console.error('등록 실패:', err);
		},
	});

	// 폼 상태 관리
	const [roomData, setRoomData] = useState({
		id: '', // 강의실 호수 (예: "101호")
		collegeId: '', // 단과대 ID
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setRoomData({ ...roomData, [name]: value });
	};

	const handleSubmit = async () => {
		createRoomMutation.mutate(roomData);
	};

	/**
	const handleSubmit = async () => {
		try {
			const res = await api.post('/admin/room', roomData);
			console.log('강의실 등록 성공:', res.data);
			alert('강의실 등록 완료!');
		} catch (e) {
			console.error('강의실 등록 실패:', e);
		}
	};
	 */

	const headers = ['강의실', '단과대', '단과대아이디'];

	return (
		<div className="form-container">
			<h3>강의실 등록</h3>
			<div className="room--form">
				<InputForm label="강의실 호수" name="id" value={roomData.id} onChange={handleChange} placeholder="예: 101" />
				<InputForm
					label="단과대 ID"
					name="collegeId"
					value={roomData.collegeId}
					onChange={handleChange}
					placeholder="숫자 입력"
				/>

				{/* 로딩 중이면 버튼 비활성화 기능도 공짜로 줌 */}
				<button onClick={handleSubmit} className="button" disabled={createRoomMutation.isPending}>
					{createRoomMutation.isPending ? '등록 중...' : '강의실 등록'}
				</button>
			</div>

			<h3>강의실 목록</h3>
			<div>
				<DataTable headers={headers} data={roomList} />
			</div>
		</div>
	);
}
