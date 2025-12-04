import { Route, Routes } from "react-router-dom";
import Main from "./pages/Main";
import "./App.css";

function App() {
  // 전역 변수 useContext - user (id 학번, userRole 권한)

  const [count, setCount] = useState(0);

  return (
    <Routes>
      <Route path="/main" element={<Main />} />
    </Routes>
  );
}

export default App;
