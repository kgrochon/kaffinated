import { useState, useMemo } from "react";
import { castData, palette } from "../assets/data/TableData";
import "./styles/connections.css";

export default function PlayerConnections() {
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [hoveredPlayer, setHoveredPlayer] = useState<string | null>(null);

  // Calculate connections between players (shared seasons)
  const connections = useMemo(() => {
    const connectionMap = new Map<string, Map<string, number[]>>();

    castData.forEach((player1) => {
      const player1Seasons = new Set(player1.seasons.map(s => s.season));

      castData.forEach((player2) => {
        if (player1.name === player2.name) return;

        const sharedSeasons = player2.seasons
          .map(s => s.season)
          .filter(season => player1Seasons.has(season));

        if (sharedSeasons.length > 0) {
          if (!connectionMap.has(player1.name)) {
            connectionMap.set(player1.name, new Map());
          }
          connectionMap.get(player1.name)!.set(player2.name, sharedSeasons);
        }
      });
    });

    return connectionMap;
  }, []);

  const activePlayer = selectedPlayer || hoveredPlayer;

  const handlePlayerClick = (playerName: string) => {
    if (selectedPlayer === playerName) {
      setSelectedPlayer(null);
    } else {
      setSelectedPlayer(playerName);
    }
  };

  const handleContainerClick = () => {
    console.log('Container clicked - current selected:', selectedPlayer, 'hovered:', hoveredPlayer);
    setSelectedPlayer(null);
    setHoveredPlayer(null);
  };

  // Get connections for active player
  const activeConnections = activePlayer ? connections.get(activePlayer) : null;

  // Sort players by number of connections
  const sortedPlayers = useMemo(() => {
    return [...castData].sort((a, b) => {
      const aConnections = connections.get(a.name)?.size || 0;
      const bConnections = connections.get(b.name)?.size || 0;
      return bConnections - aConnections;
    });
  }, [connections]);

  return (
    <div className="connections-container" onClick={handleContainerClick}>
      <div className="connections-wrapper">
        {/* Overview */}
        <div className="survivor-overview">
          <p>
          Explore the web of relationships between returning players
        </p>
        <p className="survivor-subtex">
          Click or hover over a player to see their network
          </p>
        </div>

        {/* Players Grid */}
        <div className="connections-grid">
          {sortedPlayers.map((player) => {
            const tribeColor = palette[player.tribe.toLowerCase() as keyof typeof palette] || palette.ink;
            const isActive = activePlayer === player.name;
            const isConnected = activeConnections?.has(player.name);
            const isDimmed = activePlayer !== null && !isActive && !isConnected;
            const connectionCount = connections.get(player.name)?.size || 0;
            const sharedSeasons = activeConnections?.get(player.name) || [];

            return (
              <div
                key={player.name}
                className={`connection-card ${isDimmed ? "dimmed" : ""} ${isActive ? "active" : ""} ${isConnected ? "connected" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayerClick(player.name);
                }}
                onMouseEnter={() => !selectedPlayer && setHoveredPlayer(player.name)}
                onMouseLeave={() => !selectedPlayer && setHoveredPlayer(null)}
                style={{
                  backgroundColor: isActive ? tribeColor : '#ffffff',
                  borderColor: isConnected ? tribeColor : 'var(--color-text)',
                }}
              >
                <div className="connection-photo-container">
                  <img
                    src={player.photo}
                    alt={player.name}
                    className="connection-photo"
                  />
                  {isConnected && sharedSeasons.length > 0 && (
                    <div
                      className="shared-seasons-badge"
                      style={{ backgroundColor: tribeColor }}
                    >
                      {sharedSeasons.length}
                    </div>
                  )}
                </div>
                <div className="connection-info">
                  <div
                    className="connection-name"
                    style={{
                      color: isActive ? '#ffffff' : 'var(--color-text)',
                      fontWeight: isActive || isConnected ? 600 : 400
                    }}
                  >
                    {player.name.split(' ')[0]}
                  </div>
                  <div
                    className="connection-count"
                    style={{ color: isActive ? '#ffffff' : 'var(--color-text-muted)' }}
                  >
                    {connectionCount} {connectionCount === 1 ? 'connection' : 'connections'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Connection Details */}
        {/* {activePlayer && activeConnections && (
          <div className="connection-details">
            <h3 className="details-title">
              {activePlayer.split(' ')[0]} played with {activeConnections.size} {activeConnections.size === 1 ? 'player' : 'players'}
            </h3>
            <div className="details-list">
              {Array.from(activeConnections.entries()).map(([connectedPlayer, seasons]) => {
                const player = castData.find(p => p.name === connectedPlayer);
                const tribeColor = player ? palette[player.tribe.toLowerCase() as keyof typeof palette] : palette.ink;

                return (
                  <div key={connectedPlayer} className="detail-item">
                    <div
                      className="detail-badge"
                      style={{ backgroundColor: tribeColor }}
                    >
                      {seasons.length}
                    </div>
                    <div className="detail-name">
                      {connectedPlayer.split(' ')[0]}
                    </div>
                    <div className="detail-seasons">
                      Season{seasons.length > 1 ? 's' : ''}: {seasons.join(', ')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}
