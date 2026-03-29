import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Home } from "./pages/Home";
import { Survivor } from "./pages/Survivor";
import { TierList } from "./projects/tier-list/TierList";
import { About } from "./pages/About";
import { UPTrip } from "./projects/up-trip/UPTrip";

function App() {
    return (
        <div className="app">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/survivor" element={<Survivor />} />
                    <Route path="/up-trip" element={<UPTrip />} />
                    <Route path="/tier-list" element={<TierList />} />
                    <Route path="/about" element={<About />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
