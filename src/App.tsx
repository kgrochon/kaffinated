import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Home } from "./pages/Home";
import { Survivor } from "./pages/Survivor";
import { TierList } from "./components/tier-list/TierList";

function App() {
    return (
        <div className="app">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/survivor" element={<Survivor />} />
                    <Route path="/tier-list" element={<TierList />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
