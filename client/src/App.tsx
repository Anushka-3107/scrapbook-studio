import DiaryEditor from "./components/diary/DiaryEditor";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Homes"

function App() {
  return (
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/diary/new" element={<DiaryEditor />} />
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;