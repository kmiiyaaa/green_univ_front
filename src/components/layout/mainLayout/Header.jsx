function Header() {
  return (
    <header class="d-flex flex-column">
      <div class="header--top">
        <ul>
          <li class="material--li">
            <span class="material-symbols-outlined">account_circle</span>
          </li>
          <li>(이름)님, (아이디)</li>
          <li class="material--li">
            <span class="material-symbols-outlined">logout</span>
          </li>
          <li>
            <a href="/logout">로그아웃</a>
          </li>
        </ul>
      </div>

      <nav class="main--menu">
        <a href="/">
          <img class="logo" alt="" src="/images/logo.png" />
        </a>
        {/* userRole에 따라 메뉴 다르게 표시 */}
        {/* 학생일 때 */}
        <ul>
          <li>
            <a href="/">홈</a>
          </li>
          <li>
            <a href="/info/student">MY</a>
          </li>
          <li>
            <a href="/subject/list/1">수업</a>
          </li>
          <li>
            <a href="/sugang/subjectList/1">수강신청</a>
          </li>
          <li>
            <a href="/grade/thisSemester">성적</a>
          </li>
          <li>
            <a href="/notice">학사정보</a>
          </li>
        </ul>

        {/* 교수일 때 */}
        <ul>
          <li>
            <a href="/">홈</a>
          </li>
          <li>
            <a href="/info/professor">MY</a>
          </li>
          <li>
            <a href="/subject/list/1">수업</a>
          </li>
          <li>
            <a href="/notice">학사정보</a>
          </li>
        </ul>

        {/* 직원일 때 */}
        <ul>
          <li>
            <a href="/">홈</a>
          </li>
          <li>
            <a href="/info/staff">MY</a>
          </li>
          <li>
            <a href="/user/studentList">학사관리</a>
          </li>
          <li>
            <a href="/admin/college">등록</a>
          </li>
          <li>
            <a href="/notice">학사정보</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
export default Header;
