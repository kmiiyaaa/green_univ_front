import OptionForm from '../form/OptionForm';

// 과목 선택 공통 컴포넌트
// subjects: [{ id, name }]
export default function SubjectSelect({
	label = '과목',
	subjects = [],
	value,
	onChange,
	includeAll = true,
}) {
	const options = [];

	if (includeAll) {
		options.push({ value: '', label: '전체' });
	}

	subjects.forEach((s) => {
		options.push({
			value: String(s.id),
			label: s.name,
		});
	});

	return (
		<OptionForm
			label={label}
			name="subjectId"
			value={value}
			onChange={onChange}
			options={options}
		/>
	);
}
