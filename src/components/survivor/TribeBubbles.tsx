import { useMemo, useState } from "react";
import { castData, tribeColors } from "../../data/table";
import { eliminated } from "../../data/connections";
import "./styles/tribebubbles.css";

interface PlayerBubble {
  name: string;
  photo: string;
  tribe: string;
  x: number;
  y: number;
  eliminated?: boolean;
  eliminationType?: "tribalCouncil" | "injury";
  prevTribe?: string;
  prevX?: number;
  prevY?: number;
  stayedWithPlayers?: string[]; // Players from previous week still in same tribe
}

interface TribeBubbleData {
  tribe: string;
  color: string;
  centerX: number;
  centerY: number;
  radius: number;
  players: PlayerBubble[];
}

export default function TribeBubbles() {
  const [hoveredPlayer, setHoveredPlayer] = useState<string | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  const weeks = ["Week 1", "Week 2", "Week 3"];

  // SVG dimensions
  const weekWidth = 400;
  const weekHeight = 600;

  // Generate tribe bubble data for each week
  const weeklyBubbles: TribeBubbleData[][] = useMemo(() => {
    return weeks.map((_, weekIndex) => {
      // Group players by tribe for this week
      const tribeGroups: Record<string, PlayerBubble[]> = {
        Cila: [],
        Vatu: [],
        Kalo: [],
      };

      castData.forEach((player) => {
        const eliminationRecord = eliminated.find((el) =>
          player.name.toLowerCase().includes(el.name.toLowerCase())
        );

        // Skip if eliminated before this week
        const isEliminated = eliminationRecord && eliminationRecord.episode <= weekIndex + 1;

        const currentTribe = player.tribe[weekIndex];
        const prevTribe = weekIndex > 0 ? player.tribe[weekIndex - 1] : undefined;

        // Find players who stayed together from previous week
        const stayedWithPlayers: string[] = [];
        if (weekIndex > 0) {
          castData.forEach((otherPlayer) => {
            if (otherPlayer.name !== player.name) {
              const otherPrevTribe = otherPlayer.tribe[weekIndex - 1];
              const otherCurrentTribe = otherPlayer.tribe[weekIndex];

              // If both were in same tribe last week AND same tribe this week
              if (otherPrevTribe === prevTribe && otherCurrentTribe === currentTribe) {
                stayedWithPlayers.push(otherPlayer.name);
              }
            }
          });
        }

        tribeGroups[currentTribe].push({
          name: player.name,
          photo: player.photo,
          tribe: currentTribe,
          x: 0, // Will be calculated
          y: 0, // Will be calculated
          eliminated: isEliminated && eliminationRecord!.episode === weekIndex + 1,
          eliminationType: isEliminated ? eliminationRecord?.type : undefined,
          prevTribe,
          stayedWithPlayers,
        });
      });

      // Create tribe bubble data
      const tribes: TribeBubbleData[] = [];
      const tribePositions = [
        { name: "Cila", y: weekHeight * 0.25 },
        { name: "Vatu", y: weekHeight * 0.5 },
        { name: "Kalo", y: weekHeight * 0.75 },
      ];

      tribePositions.forEach((tribePos) => {
        const players = tribeGroups[tribePos.name];
        const tribeColor = tribeColors.find(t => t.name === tribePos.name)!.color;

        // Calculate positions for players within tribe bubble
        const tribeRadius = 120;
        const centerX = weekWidth / 2;
        const centerY = tribePos.y;

        // Position players in a packed circle layout
        players.forEach((player, index) => {
          // Use spiral/circle packing for positioning
          const angle = (index / players.length) * 2 * Math.PI;
          const layer = Math.floor(index / 8); // 8 players per ring
          const ringRadius = 30 + layer * 35;

          player.x = centerX + Math.cos(angle) * ringRadius;
          player.y = centerY + Math.sin(angle) * ringRadius;
        });

        tribes.push({
          tribe: tribePos.name,
          color: tribeColor,
          centerX,
          centerY,
          radius: tribeRadius,
          players,
        });
      });

      return tribes;
    });
  }, []);

  // Get previous week position for connection lines
  const getPrevPosition = (playerName: string, weekIndex: number) => {
    if (weekIndex === 0) return null;

    const prevWeek = weeklyBubbles[weekIndex - 1];
    for (const tribe of prevWeek) {
      const player = tribe.players.find(p => p.name === playerName);
      if (player) {
        return {
          x: (weekIndex - 1) * weekWidth + player.x,
          y: player.y,
        };
      }
    }
    return null;
  };

  const renderConnectionLines = (weekIndex: number) => {
    if (weekIndex === 0) return null;

    const currentWeek = weeklyBubbles[weekIndex];
    const lines: React.ReactElement[] = [];

    currentWeek.forEach(tribe => {
      tribe.players.forEach(player => {
        const prevPos = getPrevPosition(player.name, weekIndex);
        if (prevPos) {
          const currentX = weekIndex * weekWidth + player.x;
          const currentY = player.y;

          const isHighlighted = hoveredPlayer === player.name || selectedPlayer === player.name;
          const isDimmed = (hoveredPlayer !== null || selectedPlayer !== null) && !isHighlighted;

          // Color based on whether they changed tribes
          const changedTribes = player.prevTribe !== player.tribe;
          const lineColor = changedTribes ? "#666" : tribe.color;

          lines.push(
            <path
              key={`connection-${player.name}-${weekIndex}`}
              d={`M ${prevPos.x} ${prevPos.y} L ${currentX} ${currentY}`}
              stroke={lineColor}
              strokeWidth={isHighlighted ? 3 : 1}
              strokeDasharray={changedTribes ? "4 4" : "none"}
              opacity={isDimmed ? 0.05 : isHighlighted ? 0.8 : 0.3}
              fill="none"
              pointerEvents="none"
            />
          );
        }
      });
    });

    return lines;
  };

  const totalWidth = weekWidth * weeks.length;

  return (
    <div className="tribe-bubbles-container">
      <div className="tribe-bubbles-wrapper">
        <p className="bubbles-description">
          Nested circles showing tribe compositions. Players who stayed together are clustered. Lines show previous relationships.
        </p>

        {/* Legend */}
        <div className="bubbles-legend">
          <div className="legend-section">
            <span className="legend-title">Tribes:</span>
            {tribeColors.map((tribe) => (
              <div key={tribe.name} className="legend-item">
                <div className="legend-bubble" style={{ backgroundColor: tribe.color }} />
                <span>{tribe.name}</span>
              </div>
            ))}
          </div>
          <div className="legend-section">
            <span className="legend-title">Lines:</span>
            <div className="legend-item">
              <div className="legend-connection solid" />
              <span>Stayed together</span>
            </div>
            <div className="legend-item">
              <div className="legend-connection dashed" />
              <span>Tribe switch</span>
            </div>
          </div>
        </div>

        {/* SVG Visualization */}
        <div className="bubbles-svg-container">
          <svg width={totalWidth} height={weekHeight} className="bubbles-svg">
            {/* Render for each week */}
            {weeks.map((week, weekIndex) => {
              const offsetX = weekIndex * weekWidth;

              return (
                <g key={week} transform={`translate(${offsetX}, 0)`}>
                  {/* Week label */}
                  <text
                    x={weekWidth / 2}
                    y={30}
                    textAnchor="middle"
                    fill="var(--color-text)"
                    fontSize="20"
                    fontWeight="bold"
                  >
                    {week}
                  </text>

                  {/* Tribe bubbles */}
                  {weeklyBubbles[weekIndex].map((tribeBubble) => (
                    <g key={tribeBubble.tribe}>
                      {/* Tribe circle */}
                      <circle
                        cx={tribeBubble.centerX}
                        cy={tribeBubble.centerY}
                        r={tribeBubble.radius}
                        fill={tribeBubble.color}
                        opacity={0.15}
                        stroke={tribeBubble.color}
                        strokeWidth={3}
                      />

                      {/* Tribe label */}
                      <text
                        x={tribeBubble.centerX}
                        y={tribeBubble.centerY - tribeBubble.radius - 10}
                        textAnchor="middle"
                        fill="var(--color-text)"
                        fontSize="16"
                        fontWeight="600"
                      >
                        {tribeBubble.tribe} ({tribeBubble.players.length})
                      </text>

                      {/* Player bubbles */}
                      {tribeBubble.players.map((player) => {
                        const isHighlighted = hoveredPlayer === player.name || selectedPlayer === player.name;
                        const isDimmed = (hoveredPlayer !== null || selectedPlayer !== null) && !isHighlighted;

                        // Visual indicator: larger if stayed with many players
                        const connectionStrength = player.stayedWithPlayers?.length || 0;
                        const baseRadius = 20;
                        const radius = baseRadius + Math.min(connectionStrength * 1, 8);

                        return (
                          <g
                            key={player.name}
                            onMouseEnter={() => setHoveredPlayer(player.name)}
                            onMouseLeave={() => setHoveredPlayer(null)}
                            onClick={() => setSelectedPlayer(selectedPlayer === player.name ? null : player.name)}
                            style={{ cursor: 'pointer' }}
                            opacity={isDimmed ? 0.2 : 1}
                          >
                            {/* Player circle with photo */}
                            <circle
                              cx={player.x}
                              cy={player.y}
                              r={radius}
                              fill="white"
                              stroke={player.eliminated ?
                                (player.eliminationType === "injury" ? "#fcdc4d" : "#ad373b")
                                : tribeBubble.color}
                              strokeWidth={isHighlighted ? 4 : 2}
                            />
                            <clipPath id={`clip-${player.name}-${weekIndex}`}>
                              <circle cx={player.x} cy={player.y} r={radius - 2} />
                            </clipPath>
                            <image
                              href={player.photo}
                              x={player.x - radius + 2}
                              y={player.y - radius + 2}
                              width={(radius - 2) * 2}
                              height={(radius - 2) * 2}
                              clipPath={`url(#clip-${player.name}-${weekIndex})`}
                            />

                            {/* Name label on hover */}
                            {isHighlighted && (
                              <text
                                x={player.x}
                                y={player.y + radius + 15}
                                textAnchor="middle"
                                fill="var(--color-text)"
                                fontSize="12"
                                fontWeight="bold"
                              >
                                {player.name.split(" ")[0]}
                              </text>
                            )}

                            {/* Connection strength indicator */}
                            {connectionStrength > 0 && !isHighlighted && (
                              <text
                                x={player.x}
                                y={player.y + 5}
                                textAnchor="middle"
                                fill="var(--color-text)"
                                fontSize="11"
                                fontWeight="bold"
                                opacity={0.7}
                              >
                                {connectionStrength}
                              </text>
                            )}
                          </g>
                        );
                      })}
                    </g>
                  ))}
                </g>
              );
            })}

            {/* Connection lines between weeks */}
            {weeks.map((_, weekIndex) => (
              <g key={`connections-${weekIndex}`}>
                {renderConnectionLines(weekIndex)}
              </g>
            ))}
          </svg>
        </div>

        {/* Info panel */}
        {(hoveredPlayer || selectedPlayer) && (
          <div className="bubbles-info-panel">
            {weeks.map((week, weekIndex) => {
              const player = weeklyBubbles[weekIndex]
                .flatMap(t => t.players)
                .find(p => p.name === (hoveredPlayer || selectedPlayer));

              if (!player) return null;

              return (
                <div key={week} className="week-info">
                  <strong>{week}:</strong> {player.tribe}
                  {player.stayedWithPlayers && player.stayedWithPlayers.length > 0 && (
                    <span className="stayed-info">
                      {" "}(stayed with {player.stayedWithPlayers.length} player{player.stayedWithPlayers.length !== 1 ? 's' : ''})
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
