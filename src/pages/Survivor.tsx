import { useState } from "react";
import { Navigation } from "../components/navigation/Navigation";
import Table from "../projects/survivor/Table";
import PlayerConnections from "../projects/survivor/PlayerConnections";
import TribeEvolution from "../projects/survivor/TribeEvolution";
import "./styles/survivor.css";

type ChartView = "seasons" | "connections" | "placements" | "teams" | "evolution" | "parallel";

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
                    className={`survivor-nav-button ${activeChart === "evolution" ? "active" : ""}`}
                    onClick={() => setActiveChart("evolution")}
                >
                    Tribe Evolution
                </button>
                {/* <button
                    className={`survivor-nav-button ${activeChart === "parallel" ? "active" : ""}`}
                    onClick={() => setActiveChart("parallel")}
                >
                    Parallel Tribes
                </button> */}
            </div>

            {/* Chart Content */}
            <div className="survivor-content">
                {activeChart === "seasons" && <Table />}
                {activeChart === "connections" && <PlayerConnections />}
                {activeChart === "evolution" && <TribeEvolution />}
                {/* {activeChart === "parallel" && <ParallelTribes />} */}
            </div>
        </div>
    );
};
