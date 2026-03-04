import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Home } from "./pages/Home";
import { Survivor } from "./components/Survivor";

function App() {
    return (
        <div className="app">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/survivor" element={<Survivor />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
