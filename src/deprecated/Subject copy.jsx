import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/httpClient';
import '../../assets/css/Subject.css';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

function Subject() {
	const { user, userRole, token } = useContext(UserContext);
	const [subject, setSubject] = useState([]); // 강의
	const [subjectList, setSubjectList] = useState([]); // 전체 강의

	// 강의 입력
	const handleSubject = async (e) => {
		e.preventDefault();
		console.log('강의등록');
		try {
			// {} 안에 post로 보낼 객체 넣어야함
			const res = await api.post('/admin/subject', {});
			setSubjectList(res.data);
			console.log(res.data);
		} catch (e) {
			console.error(e);
		}
	};

	useEffect(() => {
		// 강의 목록 조회
		const loadSubject = async () => {
			try {
				const res = api.get('/admin/subject');
				setSubjectList(res.data);
				console.log(res.data);
			} catch (e) {
				console.error(e);
			}
		};
		loadSubject();
	}, [user]);

	return (
		<>
			<main>
				<h1>강의</h1>
				<div className="split--div"></div>
				<div className="select--button">
					<a href="/admin/subject?crud=insert" className="button">
						등록
					</a>
					<a href="/admin/subject?crud=update" className="button">
						수정
					</a>
					<a href="/admin/subject?crud=delete" className="button">
						삭제
					</a>
				</div>

				<h2>강의 입력</h2>
				<form className="form--container">
					<ul className="d-flex">
						<li>
							<span className="material-symbols-outlined">school</span>
						</li>
						<li>
							<span className="insert">등록하기</span>
						</li>
					</ul>
					<div className="subject--form">
						<input type="text" className="input--box" id="name" name="name" placeholder="강의명을 입력하세요" />
						<br />
						<input
							type="text"
							className="input--box"
							id="professorId"
							name="professorId"
							placeholder="교수ID를 입력하세요"
						/>
						<br />
						<input type="text" className="input--box" id="roomId" name="roomId" placeholder="강의실을 입력하세요" />
						<br />
						<input type="text" className="input--box" id="deptId" name="deptId" placeholder="학과ID를 입력하세요" />
						<br />
						<label>전공</label>
						<input type="radio" id="major" name="type" value="전공" />
						<label>교양</label>
						<input type="radio" id="culture" name="type" value="교양" />
						<br />
						<input type="text" className="input--box" id="subYear" name="subYear" placeholder="연도를 입력하세요" />
						<br />
						<input type="text" className="input--box" id="semester" name="semester" placeholder="학기를 입력하세요" />
						<br />
						<select name="subDay" className="input--box">
							<option value="월">월</option>
							<option value="화">화</option>
							<option value="수">수</option>
							<option value="목">목</option>
							<option value="금">금</option>
						</select>
						<input
							type="text"
							className="input--box"
							id="startTime"
							name="startTime"
							placeholder="시작시간을 입력하세요"
						/>
						<br />
						<input type="text" className="input--box" id="endTime" name="endTime" placeholder="종료시간을 입력하세요" />
						<br />
						<input type="text" className="input--box" id="grades" name="grades" placeholder="학점을 입력하세요" />
						<br />
						<input type="text" className="input--box" id="capacity" name="capacity" placeholder="정원 입력하세요" />
						<br />
						<button onClick={handleSubject} className="button">
							입력
						</button>
					</div>
				</form>
			</main>
		</>
	);
}

export default Subject;
