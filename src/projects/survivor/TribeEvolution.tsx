import { useMemo } from "react";
import { castData, palette, tribeColors } from "../../data/table";
import { eliminated } from "../../data/connections";
import "./styles/tribeevolution.css";

interface PlayerJourney {
  name: string;
  photo: string;
  tribes: string[];
  eliminated?: number;
  eliminationType?: "tribalCouncil" | "injury";
}

export default function TribeEvolution() {
  const weeks = ["Week 1", "Week 2", "Week 3"];

  // Transform cast data into player journeys
  const playerJourneys: PlayerJourney[] = useMemo(() => {
    const journeys = castData.map((player) => {
      const eliminationRecord = eliminated.find((el) =>
        player.name.toLowerCase().includes(el.name.toLowerCase())
      );

      return {
        name: player.name,
        photo: player.photo,
        tribes: player.tribe,
        eliminated: eliminationRecord?.episode,
        eliminationType: eliminationRecord?.type,
      };
    });

    // Sort by elimination week (eliminated players first, sorted by week, then non-eliminated)
    return journeys.sort((a, b) => {
      if (a.eliminated && b.eliminated) {
        return a.eliminated - b.eliminated;
      }
      if (a.eliminated) return -1;
      if (b.eliminated) return 1;
      return 0;
    });
  }, []);

  return (
    <div className="tribe-evolution-container">
      <div className="tribe-evolution-wrapper">
        <p className="evolution-description">
          Track how players move between tribes across the weeks
        </p>

        {/* Legend */}
        <div className="evolution-legend">
          {tribeColors.map((tribe) => (
            <div key={tribe.name} className="legend-item">
              <div
                className="legend-color-box"
                style={{ backgroundColor: tribe.color }}
              />
              <span>{tribe.name}</span>
            </div>
          ))}
        </div>

        {/* Player streams - shows individual journeys */}
        <div className="player-streams-section">
          <div className="player-streams">
            {playerJourneys.map((player) => {
              return (
                <div key={player.name} className="player-stream">
                  <div className="stream-player-info">
                    <img
                      src={player.photo}
                      alt={player.name}
                      className="stream-photo"
                    />
                  </div>

                  <div className="stream-path">
                    {player.tribes.map((tribe, index) => {
                      const tribeColor =
                        tribeColors.find((t) => t.name === tribe)?.color ||
                        palette.warmGray;
                      const isLastSegment = index === weeks.length - 1;
                      const isEliminated =
                        player.eliminated &&
                        player.eliminated === index + 1;
                      const isAfterElimination =
                        player.eliminated &&
                        player.eliminated < index + 1;

                      return (
                        <div
                          key={`${player.name}-${index}`}
                          className={`stream-segment ${
                            isEliminated ? "eliminated-segment" : ""
                          }`}
                          style={{
                            backgroundColor: isAfterElimination ? 'transparent' : tribeColor,
                            opacity: isEliminated ? 0.5 : 1,
                          }}
                        >
                          {isEliminated && (
                            <span className="segment-eliminated-marker">
                              {player.eliminationType === "injury" ? "💊" : "✕"}
                            </span>
                          )}
                          {isLastSegment &&
                            !isEliminated &&
                            index < weeks.length - 1 && (
                              <span className="segment-ongoing">→</span>
                            )}
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
    </div>
  );
}
