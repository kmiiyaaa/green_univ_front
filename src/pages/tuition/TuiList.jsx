import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/httpClient";

export default function TuiList() {
  // 납부된 등록금 내역을 조회하는 컴포넌트
  const [tuiList, setTuiList] = useState([]);
  const navigate = useNavigate();

  const loadTuition = async () => {
    // 등록금 불러오기 (tuitionController 58번)

    if (!user || user.getUserRole != "student") {
      alert("권한이 없는 페이지입니다.");
      navigate(-1, { replace: true });
    }

    try {
      const res = await api.get("/tuition/list");
      setTuiList(res.data);
    } catch (e) {
      console.error("tuiList 불러오기 실패" + e);
    }
  };

  return (
    <div>
      <h2>등록금 내역 조회</h2>
      <hr />

      {tuiList ? (
        <>
          <ul>
            <li>등록연도</li>
            <li>등록학기</li>
            <li>장학금 유형</li>
            <li>등록금</li>
            <li>장학금</li>
            <li>납입금</li>
          </ul>

          {tuiList.map((t) => (
            <div>
              {t.tuiYear + "년"}
              {t.semester + "학기"}
              {t.schType?.name ?? ""}
              {t.tuiAmount} {/*등록 금액 */}
              {t.schAmount + "년"} {/* 장학 금액 */}
              {t.payAmount + "년"} {/* 납입금 */}
            </div>
          ))}
        </>) : (
            "등록금 납부 내역이 없습니다!"
        )
      }
    </div>
  );
}
