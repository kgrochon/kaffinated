import { useState } from "react";
import { Navigation } from "./Navigation";
import Table from "./Table";
import PlayerConnections from "./PlayerConnections";
import PlayerPlacements from "./PlayerPlacements";
import TeamStats from "./TeamStats";
import "./styles/survivor.css";

type ChartView = "seasons" | "connections" | "placements" | "teams";

export const Survivor = () => {
    const [activeChart, setActiveChart] = useState<ChartView>("seasons");

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

            {/* Chart Content */}
            <div className="survivor-content">
                {activeChart === "seasons" && <Table />}
                {activeChart === "connections" && <PlayerConnections />}
                {activeChart === "placements" && <PlayerPlacements />}
                {activeChart === "teams" && <TeamStats />}
            </div>
        </div>
    );
};
