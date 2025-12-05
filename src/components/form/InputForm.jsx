// components/form/InputForm.jsx
const InputForm = ({ label, type = 'text', name, value, onChange, placeholder }) => {
	return (
		<div className="input-group">
			<label>{label}</label>
			<input
				className="form-input"
				type={type}
				name={name} // 핵심: 이게 있어야 handleChange 하나로 다 처리 가능
				value={value}
				onChange={onChange}
				placeholder={placeholder}
			/>
		</div>
	);
};
export default InputForm;
