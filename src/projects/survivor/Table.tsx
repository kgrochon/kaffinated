import { useState, useMemo } from "react";
import { type SeasonGroup, castData, eraStyles, getEra, palette } from "../../data/table";
import { eliminated } from "../../data/connections";
import "./styles/table.css";

const normalizeName = (name: string) =>
  name.toLowerCase().replace(/[^a-z\s]/g, "").trim();

const firstName = (name: string) => normalizeName(name).split(/\s+/)[0] || "";

function levenshteinDistance(a: string, b: string) {
  const dp = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i += 1) dp[i][0] = i;
  for (let j = 0; j <= b.length; j += 1) dp[0][j] = j;

  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }

  return dp[a.length][b.length];
}

function matchesEliminationRecord(playerName: string, eliminatedName: string) {
  const playerNormalized = normalizeName(playerName);
  const eliminatedNormalized = normalizeName(eliminatedName);

  if (
    playerNormalized.includes(eliminatedNormalized) ||
    eliminatedNormalized.includes(playerNormalized)
  ) {
    return true;
  }

  const playerFirst = firstName(playerName);
  const eliminatedFirst = firstName(eliminatedName);
  if (!playerFirst || !eliminatedFirst) return false;
  if (playerFirst === eliminatedFirst) return true;

  return levenshteinDistance(playerFirst, eliminatedFirst) <= 1;
}

export default function Table() {
    const [hoveredPlayer, setHoveredPlayer] = useState<string | null>(null);
    const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

    console.log("Render - selected:", selectedPlayer, "hovered:", hoveredPlayer);

    const seasonGroups: SeasonGroup[] = useMemo(() => {
      const map = new Map<number, { subtitle: string; players: Map<string, { photo: string; tribe: string; placement: number }> }>();
      castData.forEach((player) => {
        player.seasons.forEach((s) => {
          if (!map.has(s.season)) {
            map.set(s.season, { subtitle: s.subtitle, players: new Map() });
          }
          map.get(s.season)!.players.set(player.name, { photo: player.photo, tribe: player.tribe[player.tribe.length - 1], placement: s.placement });
        });
      });
      return Array.from(map.entries())
        .sort(([a], [b]) => a - b)
        .map(([season, data]) => ({
          season,
          subtitle: data.subtitle,
          tribes: [],
          players: Array.from(data.players.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([name, { photo, tribe, placement }]) => ({ name, photo, tribe, placement })),
        }));
    }, []);

    const playerSeasons = useMemo(() => {
      const map = new Map<string, number[]>();
      castData.forEach((p) => map.set(p.name, p.seasons.map((s) => s.season)));
      return map;
    }, []);

    const activePlayer = selectedPlayer || hoveredPlayer;
    const highlightedSeasons = activePlayer ? new Set(playerSeasons.get(activePlayer) || []) : new Set<number>();

    const handlePlayerClick = (playerName: string) => {
      console.log("Player clicked:", playerName, "current selected:", selectedPlayer);
      if (selectedPlayer === playerName) {
        setSelectedPlayer(null);
      } else {
        setSelectedPlayer(playerName);
      }
    };

    const handleContainerClick = () => {
      console.log("container clicked, current selected:", selectedPlayer);
      if (selectedPlayer !== null) {
        setSelectedPlayer(null);
        setHoveredPlayer(null);
      }
    };

    const eras = [
      { key: "classic", label: "Classic Era (1–20)" },
      { key: "middle", label: "Mid Era (23–34)" },
      { key: "modern", label: "Modern Era (35–42)" },
      { key: "new", label: "New Era (45–49)" },
    ] as const;

    return (
      <div className="survivor-table-container" onClick={handleContainerClick}>
        <div className="survivor-table-wrapper">
          {/* Overview */}
          <div className="survivor-overview">
            <p>
            A comprehensive timeline of all Season 50 contestants across their Survivor careers
          </p>
          <p className="survivor-subtext">
            Click or hover over any player to see all the seasons they competed in.
          </p>
          </div>

          {/* Era Legend */}
          <div className="era-legend">
            {eras.map((e) => (
              <div key={e.key} className="era-item">
                <div
                  className="era-dot"
                  style={{ backgroundColor: eraStyles[e.key].color }}
                />
                <span className="era-label">{e.label}</span>
              </div>
            ))}
          </div>

          {/* Season Blocks */}
          <div className="seasons-container">
            {seasonGroups.map((group, i) => {
              const era = getEra(group.season);
              const style = eraStyles[era];
              const isHighlighted = highlightedSeasons.has(group.season);
              const isDimmed = activePlayer !== null && !isHighlighted;

              return (
                <div
                  key={group.season}
                  className={`season-row ${isDimmed ? "dimmed" : ""} ${isHighlighted ? "highlighted" : ""}`}
                  style={{
                    animation: `fadeInUp 0.4s ease ${i * 0.04}s both`,
                    borderLeft: `4px solid ${style.color}`,
                    backgroundColor: `${style.color}${isHighlighted ? "ad" : "36"}`,
                    
                  }}
                >
                  {/* Season Label */}
                  <div
                    className="season-label"
                    style={{
                      backgroundColor: isHighlighted ? style.color : 'transparent',
                    }}
                  >
                    <div className="season-number">
                      Season {group.season}
                    </div>
                    <div className="season-subtitle">
                      {group.subtitle}
                    </div>
                    {/* <div className="season-era" style={{ color: style.color }}>
                      {style.label}
                    </div> */}
                  </div>

                  {/* Players Grid */}
                  <div className="players-container">
                    {group.players.map((player) => {
                      const timesPlayed = playerSeasons.get(player.name)?.length || 1;
                      const isThisPlayerActive = activePlayer === player.name;
                      const isPlayerDimmed = activePlayer !== null && !isThisPlayerActive && !isHighlighted;
                      const tribeColor = palette[player.tribe.toLowerCase() as keyof typeof palette] || palette.ink;

                      // Check if player is eliminated
                      const eliminationRecord = eliminated.find((el) =>
                        matchesEliminationRecord(player.name, el.name)
                      );
                      const isEliminated = !!eliminationRecord;
                      const eliminationType = eliminationRecord?.type;

                      return (
                        <div
                          key={player.name}
                          className={`player-card ${isPlayerDimmed ? "dimmed" : ""} ${isEliminated ? "eliminated" : ""} ${eliminationType === "injury" ? "injury" : ""}`}
                          onMouseEnter={() => !selectedPlayer && setHoveredPlayer(player.name)}
                          onMouseLeave={() => !selectedPlayer && setHoveredPlayer(null)}
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlayerClick(player.name);
                          }}
                          style={{
                            backgroundColor: tribeColor,
                          }}
                        >
                          {/* Photo with frame */}
                          <div
                            className="photo-frame"
                          >
                            <img
                              src={player.photo}
                              alt={player.name}
                              className="player-photo"
                            />
                            {/* Elimination badge */}
                            {isEliminated && (
                              <div className="elimination-badge">
                                {eliminationType === "injury" ? "INJURED" : "ELIMINATED"}
                              </div>
                            )}
                            {/* Placement badge */}
                            {/* <div
                              className="placement-badge"
                              style={{
                                backgroundColor: placementStyle.bg,
                                color: placementStyle.text,
                                borderRadius: placementStyle.borderRadius
                              }}
                            >
                              {player.placement}
                            </div> */}
                            {/* Times played badge */}
                            {timesPlayed > 1 && (
                              <div
                                className="times-played-badge"
                                style={{ backgroundColor: tribeColor }}
                              >
                                {timesPlayed}×
                              </div>
                            )}
                          </div>

                          {/* Name */}
                          <div
                            className="player-name"
                            style={{
                              fontWeight: isThisPlayerActive ? 600 : 400,
                              color: 'black',
                            }}
                          >
                            {player.name.split(' ')[0]}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
