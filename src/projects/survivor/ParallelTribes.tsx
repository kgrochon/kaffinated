import { useMemo, useState } from "react";
import { castData, palette, tribeColors } from "../../data/table";
import { eliminated } from "../../data/connections";
import "./styles/paralleltribes.css";

interface PlayerPath {
  name: string;
  photo: string;
  originalTribe: string;
  path: Array<{
    week: number;
    tribe: string;
    position: number; // within tribe
    eliminated?: boolean;
    eliminationType?: "tribalCouncil" | "injury";
  }>;
}

export default function ParallelTribes() {
  const [hoveredPlayer, setHoveredPlayer] = useState<string | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTribe, setFilterTribe] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isMobile, setIsMobile] = useState(false);
  const [scale, setScale] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);

  const weeks = ["Week 1", "Week 2", "Week 3"];
  const tribes = ["Cila", "Vatu", "Kalo"];

  // Detect mobile viewport
  useState(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  });

  // Transform cast data into player paths with smart positioning
  const allPlayerPaths: PlayerPath[] = useMemo(() => {
    const paths = castData.map((player) => {
      const eliminationRecord = eliminated.find((el) =>
        player.name.toLowerCase().includes(el.name.toLowerCase())
      );

      return {
        name: player.name,
        photo: player.photo,
        originalTribe: player.tribe[0],
        tribes: player.tribe,
        eliminated: eliminationRecord?.episode,
        eliminationType: eliminationRecord?.type,
      };
    });

    // Calculate positions with bundling - group players with similar paths
    return paths.map((player) => {
      const path = player.tribes.map((tribeName, weekIndex) => {
        // For each week, sort players in tribe by their next destination
        const playersInTribe = paths.filter((p) => p.tribes[weekIndex] === tribeName);

        // Sort by next tribe to bundle paths going to same destination
        const sortedPlayers = playersInTribe.sort((a, b) => {
          const nextTribeA = a.tribes[weekIndex + 1] || a.tribes[weekIndex];
          const nextTribeB = b.tribes[weekIndex + 1] || b.tribes[weekIndex];
          return nextTribeA.localeCompare(nextTribeB);
        });

        const position = sortedPlayers.findIndex((p) => p.name === player.name);
        const isEliminated = player.eliminated === weekIndex + 1;

        return {
          week: weekIndex + 1,
          tribe: tribeName,
          position,
          eliminated: isEliminated,
          eliminationType: isEliminated ? player.eliminationType : undefined,
        };
      });

      return {
        name: player.name,
        photo: player.photo,
        originalTribe: player.originalTribe,
        path,
      };
    });
  }, []);

  // Filter players based on search and filters
  const playerPaths = useMemo(() => {
    return allPlayerPaths.filter((player) => {
      // Search filter
      if (searchQuery && !player.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Tribe filter
      if (filterTribe !== "all" && player.originalTribe !== filterTribe) {
        return false;
      }

      // Status filter
      if (filterStatus !== "all") {
        const isEliminated = player.path.some(p => p.eliminated);
        const isInjured = player.path.some(p => p.eliminationType === "injury");

        if (filterStatus === "active" && isEliminated) return false;
        if (filterStatus === "eliminated" && !isEliminated) return false;
        if (filterStatus === "injured" && !isInjured) return false;
      }

      return true;
    });
  }, [allPlayerPaths, searchQuery, filterTribe, filterStatus]);

  // SVG dimensions and layout - responsive
  const svgWidth = isMobile ? 600 : 1200;
  const svgHeight = isMobile ? 800 : 600;
  const padding = isMobile
    ? { top: 60, right: 40, bottom: 50, left: 40 }
    : { top: 80, right: 100, bottom: 60, left: 100 };
  const chartWidth = svgWidth - padding.left - padding.right;
  const chartHeight = svgHeight - padding.top - padding.bottom;

  // Calculate positions
  const weekSpacing = chartWidth / (weeks.length - 1);
  const tribeHeight = chartHeight / tribes.length;

  const getWeekX = (weekIndex: number) => padding.left + weekIndex * weekSpacing;

  const getTribeY = (tribeName: string, position: number) => {
    const tribeIndex = tribes.indexOf(tribeName);
    const tribeY = padding.top + tribeIndex * tribeHeight + tribeHeight / 2;
    // Offset by position within tribe (spread vertically)
    const offset = (position - 5) * 15; // Center around 5 players, 15px spacing for better readability
    return tribeY + offset;
  };

  const renderPath = (player: PlayerPath) => {
    const isHovered = hoveredPlayer === player.name;
    const isSelected = selectedPlayer === player.name;
    const isHighlighted = isHovered || isSelected;
    const isDimmed = (hoveredPlayer !== null || selectedPlayer !== null) && !isHighlighted;

    const pathSegments = player.path;

    return (
      <g key={player.name}>
        {/* Render path segments individually to support gradients */}
        {pathSegments.map((point, index) => {
          if (index === 0) return null;

          const prevPoint = pathSegments[index - 1];
          const x = getWeekX(index);
          const y = getTribeY(point.tribe, point.position);
          const prevX = getWeekX(index - 1);
          const prevY = getTribeY(prevPoint.tribe, prevPoint.position);
          const midX = (prevX + x) / 2;

          const segmentPath = `M ${prevX} ${prevY} C ${midX} ${prevY}, ${midX} ${y}, ${x} ${y}`;

          // Check if tribe changed
          const tribeChanged = prevPoint.tribe !== point.tribe;
          const startColor = tribeColors.find(t => t.name === prevPoint.tribe)?.color || palette.warmGray;
          const endColor = tribeColors.find(t => t.name === point.tribe)?.color || palette.warmGray;

          // Create unique gradient ID for this segment
          const gradientId = `gradient-${player.name}-${index}`;

          return (
            <g key={`segment-${player.name}-${index}`}>
              {tribeChanged && (
                <defs>
                  <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={startColor} />
                    <stop offset="100%" stopColor={endColor} />
                  </linearGradient>
                </defs>
              )}
              <>
                {/* Invisible wider path for better touch interaction */}
                {isMobile && (
                  <path
                    d={segmentPath}
                    stroke="transparent"
                    strokeWidth={20}
                    fill="none"
                    className="player-path-touch-target"
                    onTouchStart={() => setSelectedPlayer(player.name)}
                    onClick={() => setSelectedPlayer(selectedPlayer === player.name ? null : player.name)}
                    style={{ cursor: 'pointer' }}
                  />
                )}
                <path
                  d={segmentPath}
                  stroke={tribeChanged ? `url(#${gradientId})` : startColor}
                  strokeWidth={isHighlighted ? 5 : 2}
                  fill="none"
                  opacity={isDimmed ? 0.08 : isHighlighted ? 1 : 0.4}
                  strokeLinecap="round"
                  className="player-path-line"
                  onMouseEnter={() => !isMobile && setHoveredPlayer(player.name)}
                  onMouseLeave={() => !isMobile && setHoveredPlayer(null)}
                  onClick={() => setSelectedPlayer(selectedPlayer === player.name ? null : player.name)}
                  style={{
                    cursor: 'pointer',
                    transition: 'stroke-width 0.2s ease, opacity 0.2s ease',
                    filter: isHighlighted ? 'drop-shadow(0 0 4px rgba(0,0,0,0.3))' : 'none',
                    pointerEvents: isMobile ? 'none' : 'all'
                  }}
                />
              </>
            </g>
          );
        })}
        {/* Draw connection lines and points at each week */}
        {pathSegments.map((point, index) => {
          const x = getWeekX(index);
          const y = getTribeY(point.tribe, point.position);
          const currentTribeColor = tribeColors.find(t => t.name === point.tribe)?.color || palette.warmGray;

          // Check if tribe changed from previous week
          const prevPoint = index > 0 ? pathSegments[index - 1] : null;
          const tribeChanged = prevPoint && prevPoint.tribe !== point.tribe;

          return (
            <g key={`${player.name}-${index}`}>
              {/* Draw connecting line between all consecutive weeks */}
              {prevPoint && (
                <>
                  {/* Create gradient for the transition line if tribe changed */}
                  {tribeChanged && (
                    <defs>
                      <linearGradient id={`line-gradient-${player.name}-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={tribeColors.find(t => t.name === prevPoint.tribe)?.color || palette.warmGray} />
                        <stop offset="100%" stopColor={currentTribeColor} />
                      </linearGradient>
                    </defs>
                  )}
                  {/* Connecting line */}
                  <line
                    x1={getWeekX(index - 1)}
                    y1={getTribeY(prevPoint.tribe, prevPoint.position)}
                    x2={x}
                    y2={y}
                    stroke={tribeChanged ? `url(#line-gradient-${player.name}-${index})` : currentTribeColor}
                    strokeWidth={isHighlighted ? 3 : 1.5}
                    strokeDasharray={tribeChanged ? "4 2" : "none"}
                    opacity={isDimmed ? 0.1 : isHighlighted ? 0.9 : 0.5}
                    strokeLinecap="round"
                    style={{
                      pointerEvents: 'none',
                      transition: 'stroke-width 0.2s ease, opacity 0.2s ease'
                    }}
                  />
                </>
              )}

              {/* Larger invisible circle for touch targets on mobile */}
              {isMobile && (
                <circle
                  cx={x}
                  cy={y}
                  r={22}
                  fill="transparent"
                  onTouchStart={() => setSelectedPlayer(player.name)}
                  onClick={() => setSelectedPlayer(selectedPlayer === player.name ? null : player.name)}
                  style={{ cursor: 'pointer' }}
                />
              )}
              <circle
                cx={x}
                cy={y}
                r={isHighlighted ? 7 : point.eliminated ? 8 : isMobile ? 6 : 4}
                fill={point.eliminated ? (point.eliminationType === "injury" ? "#fcdc4d" : "#ad373b") : currentTribeColor}
                stroke={isHighlighted ? currentTribeColor : "var(--color-text)"}
                strokeWidth={isHighlighted ? 3 : isMobile ? 2 : 1}
                opacity={isDimmed ? 0.15 : 1}
                onMouseEnter={() => !isMobile && setHoveredPlayer(player.name)}
                onMouseLeave={() => !isMobile && setHoveredPlayer(null)}
                onClick={() => setSelectedPlayer(selectedPlayer === player.name ? null : player.name)}
                style={{
                  cursor: 'pointer',
                  transition: 'r 0.2s ease, stroke-width 0.2s ease, opacity 0.2s ease',
                  filter: isHighlighted ? 'drop-shadow(0 0 3px rgba(0,0,0,0.4))' : 'none',
                  pointerEvents: isMobile ? 'none' : 'all'
                }}
              />
            </g>
          );
        })}
        {/* Show name label if highlighted */}
        {isHighlighted && (
          <text
            x={getWeekX(pathSegments.length - 1) + 10}
            y={getTribeY(pathSegments[pathSegments.length - 1].tribe, pathSegments[pathSegments.length - 1].position)}
            fill="var(--color-text)"
            fontSize="14"
            fontWeight="bold"
            dominantBaseline="middle"
          >
            {player.name.split(" ")[0]}
          </text>
        )}
      </g>
    );
  };

  return (
    <div className="parallel-tribes-container">
      <div className="parallel-tribes-wrapper">
        <p className="parallel-description">
          Parallel coordinates showing each player's journey across tribes. Hover or click to highlight individual paths.
        </p>

        {/* Search and Filters */}
        <div className="parallel-controls" style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '20px',
          flexWrap: 'wrap',
          alignItems: 'stretch',
          flexDirection: isMobile ? 'column' : 'row'
        }}>
          <input
            type="text"
            placeholder="Search players..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: isMobile ? '12px 16px' : '8px 12px',
              border: '2px solid var(--color-text)',
              borderRadius: '6px',
              fontSize: isMobile ? '16px' : '14px',
              minWidth: isMobile ? '100%' : '200px',
              backgroundColor: 'var(--color-bg)',
              color: 'var(--color-text)',
              flex: isMobile ? '1' : 'initial'
            }}
          />
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', flex: isMobile ? '1' : 'initial' }}>
            <select
              value={filterTribe}
              onChange={(e) => setFilterTribe(e.target.value)}
              style={{
                padding: isMobile ? '12px 16px' : '8px 12px',
                border: '2px solid var(--color-text)',
                borderRadius: '6px',
                fontSize: isMobile ? '16px' : '14px',
                backgroundColor: 'var(--color-bg)',
                color: 'var(--color-text)',
                cursor: 'pointer',
                flex: isMobile ? '1' : 'initial',
                minWidth: isMobile ? '0' : 'auto'
              }}
            >
              <option value="all">All Tribes</option>
              <option value="Cila">Cila</option>
              <option value="Vatu">Vatu</option>
              <option value="Kalo">Kalo</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                padding: isMobile ? '12px 16px' : '8px 12px',
                border: '2px solid var(--color-text)',
                borderRadius: '6px',
                fontSize: isMobile ? '16px' : '14px',
                backgroundColor: 'var(--color-bg)',
                color: 'var(--color-text)',
                cursor: 'pointer',
                flex: isMobile ? '1' : 'initial',
                minWidth: isMobile ? '0' : 'auto'
              }}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="eliminated">Eliminated</option>
              <option value="injured">Injured</option>
            </select>
          </div>
          {(searchQuery || filterTribe !== "all" || filterStatus !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setFilterTribe("all");
                setFilterStatus("all");
              }}
              style={{
                padding: isMobile ? '12px 16px' : '8px 12px',
                border: '2px solid var(--color-text)',
                borderRadius: '6px',
                fontSize: isMobile ? '16px' : '14px',
                backgroundColor: 'var(--color-bg)',
                color: 'var(--color-text)',
                cursor: 'pointer',
                flex: isMobile ? '1' : 'initial',
                minHeight: isMobile ? '44px' : 'auto'
              }}
            >
              Clear Filters
            </button>
          )}
          <span style={{
            fontSize: isMobile ? '12px' : '14px',
            color: 'var(--color-text)',
            marginLeft: isMobile ? '0' : 'auto',
            alignSelf: 'center',
            textAlign: isMobile ? 'center' : 'left',
            width: isMobile ? '100%' : 'auto'
          }}>
            Showing {playerPaths.length} of {allPlayerPaths.length} players
          </span>
        </div>

        {/* Legend */}
        <div className="parallel-legend">
          <div className="legend-section">
            <span className="legend-title">Original Tribes:</span>
            {tribeColors.map((tribe) => (
              <div key={tribe.name} className="legend-item">
                <div className="legend-line" style={{ backgroundColor: tribe.color }} />
                <span>{tribe.name}</span>
              </div>
            ))}
          </div>
          <div className="legend-section">
            <span className="legend-title">Status:</span>
            <div className="legend-item">
              <div className="legend-circle" style={{ backgroundColor: "#ad373b" }} />
              <span>Eliminated</span>
            </div>
            <div className="legend-item">
              <div className="legend-circle" style={{ backgroundColor: "#fcdc4d" }} />
              <span>Injured</span>
            </div>
          </div>
        </div>

        {/* SVG Visualization */}
        <div className="parallel-svg-container" style={{ position: 'relative' }}>
          {isMobile && (
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              display: 'flex',
              gap: '8px',
              zIndex: 10
            }}>
              <button
                onClick={() => setScale(Math.min(scale + 0.2, 3))}
                style={{
                  padding: '8px 12px',
                  border: '2px solid var(--color-text)',
                  borderRadius: '6px',
                  backgroundColor: 'var(--color-bg)',
                  color: 'var(--color-text)',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                +
              </button>
              <button
                onClick={() => setScale(Math.max(scale - 0.2, 0.5))}
                style={{
                  padding: '8px 12px',
                  border: '2px solid var(--color-text)',
                  borderRadius: '6px',
                  backgroundColor: 'var(--color-bg)',
                  color: 'var(--color-text)',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                −
              </button>
              <button
                onClick={() => {
                  setScale(1);
                  setPanX(0);
                  setPanY(0);
                }}
                style={{
                  padding: '8px 12px',
                  border: '2px solid var(--color-text)',
                  borderRadius: '6px',
                  backgroundColor: 'var(--color-bg)',
                  color: 'var(--color-text)',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Reset
              </button>
            </div>
          )}
          <svg
            width={svgWidth}
            height={svgHeight}
            className="parallel-svg"
            style={{
              transform: isMobile ? `scale(${scale}) translate(${panX}px, ${panY}px)` : 'none',
              transformOrigin: 'center center',
              transition: 'transform 0.2s ease',
              touchAction: 'pan-x pan-y'
            }}
          >
            {/* Draw vertical axes for each week */}
            {weeks.map((week, weekIndex) => {
              const x = getWeekX(weekIndex);

              return (
                <g key={week}>
                  {/* Vertical axis line */}
                  <line
                    x1={x}
                    y1={padding.top}
                    x2={x}
                    y2={svgHeight - padding.bottom}
                    stroke="var(--color-text)"
                    strokeWidth={2}
                  />

                  {/* Week label */}
                  <text
                    x={x}
                    y={padding.top - 20}
                    textAnchor="middle"
                    fill="var(--color-text)"
                    fontSize="18"
                    fontWeight="bold"
                  >
                    {week}
                  </text>

                  {/* Tribe tracks */}
                  {tribes.map((tribe, tribeIndex) => {
                    const y = padding.top + tribeIndex * tribeHeight + tribeHeight / 2;
                    const tribeColor = tribeColors.find(t => t.name === tribe)?.color;

                    // Count players in this tribe at this week
                    const playersInTribe = playerPaths.filter(
                      p => p.path[weekIndex]?.tribe === tribe
                    ).length;

                    return (
                      <g key={`${week}-${tribe}`}>
                        {/* Tribe track background */}
                        <rect
                          x={x - 30}
                          y={y - 25}
                          width={60}
                          height={50}
                          fill={tribeColor}
                          opacity={0.2}
                          rx={8}
                        />

                        {/* Tribe label */}
                        <text
                          x={x}
                          y={y}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill="var(--color-text)"
                          fontSize="14"
                          fontWeight="600"
                        >
                          {tribe}
                        </text>

                        {/* Player count */}
                        <text
                          x={x}
                          y={y + 15}
                          textAnchor="middle"
                          fill="var(--color-text)"
                          fontSize="11"
                        >
                          ({playersInTribe})
                        </text>
                      </g>
                    );
                  })}
                </g>
              );
            })}

            {/* Draw all player paths */}
            {playerPaths.map(player => renderPath(player))}
          </svg>
        </div>

        {/* Player list for reference */}
        <div className="parallel-players-list">
          <h3 className="players-list-title">Click a player to highlight their path</h3>
          <div className="players-grid">
            {playerPaths.map((player) => {
              const tribeColor = tribeColors.find(t => t.name === player.originalTribe)?.color;
              const isActive = hoveredPlayer === player.name || selectedPlayer === player.name;

              return (
                <div
                  key={player.name}
                  className={`player-list-item ${isActive ? 'active' : ''}`}
                  style={{ borderColor: tribeColor }}
                  onMouseEnter={() => setHoveredPlayer(player.name)}
                  onMouseLeave={() => setHoveredPlayer(null)}
                  onClick={() => setSelectedPlayer(selectedPlayer === player.name ? null : player.name)}
                >
                  <img src={player.photo} alt={player.name} className="player-list-photo" />
                  <span className="player-list-name">{player.name.split(" ")[0]}</span>
                  <div className="player-list-indicator" style={{ backgroundColor: tribeColor }} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
