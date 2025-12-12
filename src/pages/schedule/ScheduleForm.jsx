import { useEffect, useState } from 'react';
import InputForm from '../../components/form/InputForm';
import '../../assets/css/ScheduleForm.css';

// schedule 공통 폼 (등록, 수정 , 상세 보기)
export default function ScheduleForm({
	initialValues = { startDay: '', endDay: '', information: '' },
	onSubmit,
	onCancel,
	submitLabel = '저장',
	title = '학사 일정 입력', // 타이틀 prop 추가
}) {
	const [startDay, setStartDay] = useState('');
	const [endDay, setEndDay] = useState('');
	const [information, setInformation] = useState('');

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setStartDay(initialValues.startDay ?? '');
		setEndDay(initialValues.endDay ?? '');
		setInformation(initialValues.information ?? '');
	}, [initialValues]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!onSubmit) return;
		await onSubmit({ startDay, endDay, information });
	};

	return (
		<div className="schedule-form-wrapper">
			<h3 className="form-title">{title}</h3>

			<form onSubmit={handleSubmit}>
				<div className="form-grid">
					{/* 시작 날짜 */}
					<div className="form-group">
						{/* TODO: 날짜의 연도 부분이 4자리가 아니라 6자리임 */}
						<label className="form-label">시작 날짜</label>
						<input
							type="date"
							className="form-input"
							value={startDay}
							onChange={(e) => setStartDay(e.target.value)}
							required
						/>
					</div>
					<br />

					{/* 종료 날짜 */}
					<div className="form-group">
						<label className="form-label">종료 날짜</label>
						<input
							type="date"
							className="form-input"
							value={endDay}
							onChange={(e) => setEndDay(e.target.value)}
							required
						/>
					</div>

					<div className="form-group form-full-width">
						<InputForm
							label="내용"
							name="information"
							placeholder="학사 일정 내용을 입력하세요"
							value={information}
							onChange={(e) => setInformation(e.target.value)}
						/>
					</div>
				</div>

				<div className="form-actions">
					<button type="button" className="btn btn-cancel" onClick={onCancel}>
						취소
					</button>
					<button type="submit" className="btn btn-submit">
						{submitLabel}
					</button>
				</div>
			</form>
		</div>
	);
}
