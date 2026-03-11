import { useState } from "react";
import { Navigation } from "../components/navigation/Navigation";
import Table from "../components/survivor/Table";
import PlayerConnections from "../components/survivor/PlayerConnections";
import PlayerPlacements from "../components/survivor/PlayerPlacements";
import TeamStats from "../components/survivor/TeamStats";
import "./styles/survivor.css";

type ChartView = "seasons" | "connections" | "placements" | "teams";

export const Survivor = () => {
    const [activeChart, setActiveChart] = useState<ChartView>("seasons");
    const [hidePlacements, setHidePlacements] = useState(true);

    return (
        <div className="notes">
            <Navigation />

            {/* Survivor Header */}
            <div className="survivor-header">
                <h1 className="survivor-title">
                    SURVIVOR
                </h1>
                <div className="survivor-subtitle">
                    Season 50 · In the Hands of the Fans
                </div>
            </div>

            {/* Chart Navigation */}
            <div className="survivor-nav-container">
            <div className="survivor-nav">
                <button
                    className={`survivor-nav-button ${activeChart === "seasons" ? "active" : ""}`}
                    onClick={() => setActiveChart("seasons")}
                >
                    Season View
                </button>
                <button
                    className={`survivor-nav-button ${activeChart === "connections" ? "active" : ""}`}
                    onClick={() => setActiveChart("connections")}
                >
                    Connections
                </button>
                <button
                    className={`survivor-nav-button ${activeChart === "placements" ? "active" : ""}`}
                    onClick={() => setActiveChart("placements")}
                >
                    Placements
                </button>
                <button
                    className={`survivor-nav-button ${activeChart === "teams" ? "active" : ""}`}
                    onClick={() => setActiveChart("teams")}
                >
                    Team Stats
                </button>
                </div>
                <label style={{ margin: 'auto', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        checked={hidePlacements}
                        onChange={(e) => setHidePlacements(e.target.checked)}
                        style={{ cursor: 'pointer' }}
                    />
                    <span>No Spoilers!</span>
                </label>
            </div>

            {/* Chart Content */}
            <div className="survivor-content">
                {activeChart === "seasons" && <Table hidePlacements={hidePlacements} />}
                {activeChart === "connections" && <PlayerConnections />}
                {activeChart === "placements" && <PlayerPlacements hidePlacements={hidePlacements} />}
                {activeChart === "teams" && <TeamStats />}
            </div>
        </div>
    );
};
