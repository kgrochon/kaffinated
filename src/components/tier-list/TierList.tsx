import { useState } from "react";
import { Navigation } from "../navigation/Navigation";
import "./tierlist.css";

type TierListView = "builder" | "gallery";

export const TierList = () => {
  const [activeView, setActiveView] = useState<TierListView>("builder");

  return (
    <div className="notes">
      <Navigation />

      <div className="tierlist-header">
        <h1 className="tierlist-title">TIER LIST</h1>
        <div className="tierlist-subtitle">Create and Share Your Rankings</div>
      </div>

      <div className="tierlist-nav">
        <button
          onClick={() => setActiveView("builder")}
          className={`tierlist-nav-button ${activeView === "builder" ? "active" : ""}`}
        >
          Builder
        </button>
        <button
          onClick={() => setActiveView("gallery")}
          className={`tierlist-nav-button ${activeView === "gallery" ? "active" : ""}`}
        >
          Gallery
        </button>
      </div>

      <div className="tierlist-content">
        {activeView === "builder" && (
          <div className="tierlist-view">
            <p>Tier List Builder - Coming Soon</p>
          </div>
        )}
        {activeView === "gallery" && (
          <div className="tierlist-view">
            <p>Tier List Gallery - Coming Soon</p>
          </div>
        )}
      </div>
    </div>
  );
};
