// src/components/admin/user/CommonUserFields.jsx
export default function CommonUserFields({ formData, onChange }) {
	return (
		<>
			<tr>
				<td>
					<label htmlFor="name">이름</label>
				</td>
				<td>
					<input type="text" name="name" id="name" className="input--box" value={formData.name} onChange={onChange} />
				</td>
			</tr>
			<tr>
				<td>
					<label htmlFor="birthDate">생년월일</label>
				</td>
				<td>
					<input
						type="date"
						name="birthDate"
						id="birthDate"
						className="input--box"
						value={formData.birthDate}
						onChange={onChange}
					/>
				</td>
			</tr>
			<tr>
				<td>
					<label>성별</label>
				</td>
				<td>
					<label htmlFor="male">남성</label>
					<input
						type="radio"
						name="gender"
						id="male"
						value="남성"
						checked={formData.gender === '남성'}
						onChange={onChange}
					/>
					&nbsp;
					<label htmlFor="female">여성</label>
					<input
						type="radio"
						name="gender"
						id="female"
						value="여성"
						checked={formData.gender === '여성'}
						onChange={onChange}
					/>
				</td>
			</tr>
			<tr>
				<td>
					<label htmlFor="address">주소</label>
				</td>
				<td>
					<input
						type="text"
						name="address"
						id="address"
						className="input--box"
						value={formData.address}
						onChange={onChange}
					/>
				</td>
			</tr>
			<tr>
				<td>
					<label htmlFor="tel">전화번호</label>
				</td>
				<td>
					<input type="text" name="tel" id="tel" className="input--box" value={formData.tel} onChange={onChange} />
				</td>
			</tr>
			<tr>
				<td>
					<label htmlFor="email">이메일</label>
				</td>
				<td>
					<input
						type="text"
						name="email"
						id="email"
						className="input--box"
						value={formData.email}
						onChange={onChange}
					/>
				</td>
			</tr>
		</>
	);
}
