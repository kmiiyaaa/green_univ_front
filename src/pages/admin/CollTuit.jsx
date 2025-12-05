// components/feature/RoomForm.jsx
import { useEffect, useState } from 'react';
import api from '../../api/httpClient';
import InputForm from './../../components/form/InputForm';
import DataTable from '../../components/table/DataTable';

const CollTuit = () => {
	// 단대별 등록금 전용 상태 관리
	const [formData, setFormData] = useState({
		collegeId: '',
		collegeName: '',
		amount: '',
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async () => {
		try {
			const res = await api.post('/admin/tuition', formData);
			console.log('단대별 등록금 등록 성공:', res.data);
			alert('단대별 등록금 등록 완료!');
		} catch (e) {
			console.error('단대별 등록금 등록 실패:', e);
		}
	};

	// 단대별 등록금 목록 가져오기
	const [collTuit, setCollTuit] = useState([]);

	useEffect(() => {
		const loadCollTuit = async () => {
			try {
				const res = await api.get('/admin/tuition');
				console.log(res.data.collTuitList);
				const rawData = res.data.collTuitList;
				const formattedData = rawData.map((col) => ({
					id: col.id,
					단과대: col.name,
					등록금: col.amount,
					원본데이터: col, // 필요하면 원본도 통째로 넣어둠 (선택사항)
				}));

				setCollTuit(formattedData);
				console.log('가공된 데이터:', formattedData);
			} catch (e) {
				console.error('단대별 등록금 목록 로드 실패:', e);
			}
		};
		loadCollTuit();
	}, []);

	// 테이블 헤더 정의 (데이터의 키값과 글자 하나라도 틀리면 안 나옴!)
	const headers = ['단과대', '등록금'];

	return (
		<div className="form-container">
			<h3>단대별 등록금 등록</h3>
			<div className="room--form">
				<InputForm
					label="단과대 ID"
					name="collegeId"
					placeholder="입력"
					value={formData.collegeId}
					onChange={handleChange}
				/>
				<InputForm
					label="단과대 이름"
					name="collegeName"
					placeholder="입력"
					value={formData.collegeName}
					onChange={handleChange}
				/>
				<InputForm label="등록금" name="amount" placeholder="입력" value={formData.amount} onChange={handleChange} />

				<button onClick={handleSubmit} className="button">
					단대별 등록금 등록
				</button>
			</div>

			<h3>단대별 등록금 목록</h3>
			<div>
				<DataTable
					headers={headers}
					data={collTuit}
					onRowClick={(row) => {
						// row에는 위에서 가공한 한글 키들이 들어있음
						console.log('클릭한 단대별 등록금:', row.등록금);
						// 상세페이지 이동 시 row.id나 row.원본데이터 사용 가능
					}}
				/>
			</div>
		</div>
	);
};
export default CollTuit;
