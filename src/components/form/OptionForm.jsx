const OptionForm = ({ name, value, onChange, label }) => {
	return (
		<div className="option-group">
			<select name={name} value={value} onChange={onChange}>
				<option value={value}>{label}</option>
			</select>
		</div>
	);
};

export default OptionForm;
