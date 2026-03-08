import { useMemo, useState } from "react";
import { castData, palette, tribeColors } from "../assets/data/TableData";
import { eliminated } from "../assets/data/images/ConnectionData";
import "./styles/teamstats.css";

interface EnhancedPlayer {
  name: string;
  tribe: "Cila" | "Vatu" | "Kalo";
  photo: string;
  status: "active" | "eliminated" | "injured";
  eliminationEpisode?: number;
}

export default function TeamStats() {
  const [hoveredPlayer, setHoveredPlayer] = useState<string | null>(null);
  const [showEliminated, setShowEliminated] = useState(true);

  // Merge player data with elimination status
  const enhancedPlayers = useMemo(() => {
    return castData.map((player) => {
      // Check if player is eliminated (match by partial name)
      const eliminationRecord = eliminated.find((el) =>
        player.name.toLowerCase().includes(el.name.toLowerCase())
      );

      const enhanced: EnhancedPlayer = {
        name: player.name,
        tribe: player.tribe,
        photo: player.photo,
        status: eliminationRecord
          ? eliminationRecord.type === "injury"
            ? "injured"
            : "eliminated"
          : "active",
        eliminationEpisode: eliminationRecord?.episode,
      };

      return enhanced;
    });
  }, []);

  // Group players by tribe
  const teamGroups = useMemo(() => {
    const groups = tribeColors.map((tribe) => {
      const players = enhancedPlayers.filter((p) => p.tribe === tribe.name);
      const activePlayers = players.filter((p) => p.status === "active");

      return {
        name: tribe.name,
        color: tribe.color,
        players: showEliminated ? players : activePlayers,
        activeCount: activePlayers.length,
        totalCount: players.length,
      };
    });

    return groups;
  }, [enhancedPlayers, showEliminated]);

  return (
    <div className="team-stats-container">
      <div className="team-stats-wrapper">
        {/* Header */}
        <div className="team-stats-header">
          <p className="team-stats-description">
            Players grouped by tribe with elimination status
          </p>
          <div className="team-stats-controls">
            <button
              className="toggle-button"
              onClick={() => setShowEliminated(!showEliminated)}
            >
              {showEliminated ? "Hide" : "Show"} Eliminated Players
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="status-legend">
          <div className="legend-item">
            <div className="legend-indicator active"></div>
            <span>Active</span>
          </div>
          <div className="legend-item">
            <div className="legend-indicator eliminated"></div>
            <span>Eliminated</span>
          </div>
          <div className="legend-item">
            <div className="legend-indicator injured"></div>
            <span>Injured</span>
          </div>
        </div>

        {/* Team Sections */}
        {teamGroups.map((team) => (
          <div key={team.name} className="team-section">
            <div
              className="team-header"
              style={{ borderColor: team.color }}
            >
              <h2 className="team-name" style={{ color: team.color }}>
                {team.name}
              </h2>
              <div className="team-count">
                <span className="count-active">{team.activeCount}</span>
                <span className="count-separator">/</span>
                <span className="count-total">{team.totalCount}</span>
                <span className="count-label">active</span>
              </div>
            </div>

            <div className="player-grid">
              {team.players.map((player) => {
                const isHovered = hoveredPlayer === player.name;
                const statusClass = player.status;

                return (
                  <div
                    key={player.name}
                    className={`player-card ${statusClass} ${
                      isHovered ? "hovered" : ""
                    }`}
                    onMouseEnter={() => setHoveredPlayer(player.name)}
                    onMouseLeave={() => setHoveredPlayer(null)}
                    style={{
                      borderColor:
                        player.status === "eliminated"
                          ? "#ad373b"
                          : player.status === "injured"
                          ? "#fcdc4d"
                          : team.color,
                    }}
                  >
                    <div className="player-photo-container">
                      <img
                        src={player.photo}
                        alt={player.name}
                        className="player-photo"
                      />
                      {player.eliminationEpisode && (
                        <div className="episode-badge">
                          Ep {player.eliminationEpisode}
                        </div>
                      )}
                    </div>
                    <div className="player-info">
                      <div className="player-name">
                        {player.name.split(" ")[0]}
                      </div>
                      <div className="player-status">
                        {player.status === "active"
                          ? "Active"
                          : player.status === "eliminated"
                          ? "Eliminated"
                          : "Injured"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
