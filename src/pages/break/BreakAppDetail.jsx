export default function BreakAppDetail() {

    

	return (
		<div>
				<main>
		<h1>휴학 내역 조회</h1>
		<div class="split--div"></div>

		<div class="d-flex flex-column align-items-center" style="width: 100%">
			<div class="document--layout">
				<h3>휴학 신청서</h3>
				<table border="1">
					<tr>
						<th>단 과 대</th>
						<td>${collName}</td>
						<th>학 과</th>
						<td>${deptName}</td>
					</tr>
					<tr>
						<th>학 번</th>
						<td>${student.id}</td>
						<th>학 년</th>
						<td>${breakApp.studentGrade}학년</td>
					</tr>
					<tr>
						<th>전 화 번 호</th>
						<td>${student.tel}</td>
						<th>성 명</th>
						<td>${student.name}</td>
					</tr>
					<tr>
						<th>주 소</th>
						<td colspan="3">${student.address}</td>
					</tr>
					<tr>
						<th>기 간</th>
						<td colspan="3">${breakApp.fromYear}년도 ${breakApp.fromSemester}학기부터&nbsp; ${breakApp.toYear}년도 ${breakApp.toSemester}학기까지</td>
					</tr>
					<tr>
						<th>휴 학 구 분</th>
						<td colspan="3">${breakApp.type}휴학</td>
					</tr>
					<tr>
						<td colspan="4">
							<p>위와 같이 휴학하고자 하오니 허가하여 주시기 바랍니다.</p> <br>
							<p>${breakApp.appDateFormat()}</p>
						</td>
					</tr>
				</table>
			</div>

			<c:if test="${breakApp.status.equals(\"처리중\")}">
				<c:choose>
					<c:when test="${principal.userRole.equals(\"student\")}">
						<form action="/break/delete/${breakApp.id}" method="post" class="d-flex flex-column align-items-center">
							<button type="submit" class="btn btn-dark" onclick="return confirm('신청을 취소하시겠습니까?')">취소하기</button>
						</form>
					</c:when>
					<c:when test="${principal.userRole.equals(\"staff\")}">
						<div class="d-flex jusitify-contents-center">
							<form action="/break/update/${breakApp.id}" method="post" class="d-flex flex-column align-items-center">
								<input type="hidden" name="status" value="승인">
								<button type="submit" class="btn btn-dark" onclick="return confirm('해당 신청을 승인하시겠습니까?')">승인하기</button>
							</form>
							&nbsp; &nbsp; &nbsp;
							<form action="/break/update/${breakApp.id}" method="post" class="d-flex flex-column align-items-center">
								<input type="hidden" name="status" value="반려">
								<button type="submit" class="btn btn-dark" onclick="return confirm('해당 신청을 반려하시겠습니까?')">반려하기</button>
							</form>
						</div>
					</c:when>
				</c:choose>
			</c:if>

		</div>
	</main>
		</div>
	);
}
