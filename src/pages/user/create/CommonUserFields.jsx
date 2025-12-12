import InputForm from '../../../components/form/InputForm';
import RadioForm from '../../../components/form/RadioForm';

export default function CommonUserFields({ formData, onChange }) {
	// 성별 옵션 정의
	// 화면에 보일 글자는 label, 서버로 보낼 값은 value
	const genderOptions = [
		{ label: '여성', value: '여성' },
		{ label: '남성', value: '남성' },
	];

	return (
		<>
			<InputForm label="이름" name="name" value={formData.name} onChange={onChange} />
			{/* TODO: 생년월일 막기 */}
			<InputForm
				label="생년월일"
				type="date"
				name="birthDate"
				value={formData.birthDate}
				onChange={onChange}
				placeholder="예 : YYYY-MM-DD"
			/>
			<RadioForm label="성별" name="gender" value={formData.gender} onChange={onChange} options={genderOptions} />
			<InputForm label="주소" name="address" value={formData.address} onChange={onChange} />
			<InputForm
				label="전화번호"
				name="tel"
				value={formData.tel}
				onChange={onChange}
				placeholder="예 : 010-1111-1111"
			/>
			<InputForm
				label="이메일"
				name="email"
				value={formData.email}
				onChange={onChange}
				placeholder="예 : abc@gmail.com"
			/>
		</>
	);
}
