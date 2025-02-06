import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Canvas from "./components/Canvas";
import Settings from "./components/Settings";
import ToolBar from "./components/ToolBar";
import "./styles/app.scss";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route
            path="/:id"
            element={
              <>
                <ToolBar />
                <Settings />
                <Canvas />
              </>
            }
          />
          <Route
            path="*"
            element={<Navigate to={`/${(+new Date()).toString(16)}`} />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
