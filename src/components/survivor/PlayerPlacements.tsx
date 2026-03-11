import { useState, useMemo } from "react";
import { castData, palette } from "../../data/table";
import "./styles/placements.css";

type SortOption = 'best' | 'average' | 'times' | 'tribe' | 'nameAsc' | 'nameDesc';

export default function PlayerPlacements({ hidePlacements = false }: { hidePlacements?: boolean }) {
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('best');

  // Calculate player statistics
  const playerStats = useMemo(() => {
    return castData.map((player) => {
      const placements = player.seasons.map(s => s.placement);
      const bestPlacement = Math.min(...placements);
      const avgPlacement = placements.reduce((a, b) => a + b, 0) / placements.length;
      const wins = placements.filter(p => p === 1).length;
      const topThree = placements.filter(p => p <= 3).length;

      return {
        name: player.name,
        tribe: player.tribe,
        photo: player.photo,
        seasons: player.seasons,
        bestPlacement,
        avgPlacement,
        wins,
        topThree,
        timesPlayed: player.seasons.length,
      };
    });
  }, []);

  // Sort players based on selected criteria
  const sortedPlayers = useMemo(() => {
    const sorted = [...playerStats];

    switch(sortBy) {
      case 'best':
        return sorted.sort((a, b) => {
          if (a.bestPlacement !== b.bestPlacement) {
            return a.bestPlacement - b.bestPlacement;
          }
          return a.avgPlacement - b.avgPlacement;
        });

      case 'average':
        return sorted.sort((a, b) => {
          if (a.avgPlacement !== b.avgPlacement) {
            return a.avgPlacement - b.avgPlacement;
          }
          return a.bestPlacement - b.bestPlacement;
        });

      case 'times':
        return sorted.sort((a, b) => {
          if (b.timesPlayed !== a.timesPlayed) return b.timesPlayed - a.timesPlayed;
          if (a.bestPlacement !== b.bestPlacement) {
            return a.bestPlacement - b.bestPlacement;
          }
          return a.avgPlacement - b.avgPlacement;
        });

      case 'tribe':
        return sorted.sort((a, b) => {
          const tribeCompare = a.tribe.localeCompare(b.tribe);
          if (tribeCompare !== 0) return tribeCompare;
          if (a.bestPlacement !== b.bestPlacement) {
            return a.bestPlacement - b.bestPlacement;
          }
          return a.avgPlacement - b.avgPlacement;
        });

      case 'nameAsc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));

      case 'nameDesc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));

      default:
        return sorted;
    }
  }, [playerStats, sortBy]);

  const handleContainerClick = () => {
    if (selectedPlayer !== null) {
      setSelectedPlayer(null);
    }
  };

  // Calculate ranks with ties based on sort criteria
  const playersWithRanks = useMemo(() => {
    // For tribe sorting, reset rank within each tribe
    if (sortBy === 'tribe') {
      let currentTribe = '';
      let tribeRank = 1;

      return sortedPlayers.map((player, _index) => {
        if (player.tribe !== currentTribe) {
          currentTribe = player.tribe;
          tribeRank = 1;
        } else {
          tribeRank++;
        }

        return { ...player, rank: tribeRank };
      });
    }

    // For other sort options, use standard ranking with ties
    let currentRank = 1;
    return sortedPlayers.map((player, index) => {
      if (index > 0) {
        const prev = sortedPlayers[index - 1];
        let isTie = false;

        switch(sortBy) {
          case 'best':
            isTie = player.bestPlacement === prev.bestPlacement;
            break;
          case 'average':
            isTie = player.avgPlacement === prev.avgPlacement;
            break;
          case 'times':
            isTie = player.timesPlayed === prev.timesPlayed;
            break;
          case 'nameAsc':
          case 'nameDesc':
            // No ties for alphabetical sorting
            isTie = false;
            break;
        }

        if (!isTie) {
          currentRank = index + 1;
        }
      }

      return { ...player, rank: currentRank };
    });
  }, [sortedPlayers, sortBy]);

  const getPlacementColor = (placement: number) => {
    if (placement === 1) return '#FFD700'; // Gold
    if (placement === 2) return '#C0C0C0'; // Silver
    if (placement === 3) return '#CD7F32'; // Bronze
    if (placement <= 5) return palette.olive; // Top 5
    if (placement <= 10) return palette.slate; // Top 10
    return palette.warmGray; // Everyone else
  };

  if (hidePlacements) {
    return (
      <div className="placements-container">
        <div className="placements-wrapper">
          <p className="survivor-overview" style={{ textAlign: 'center', padding: '40px 20px', fontSize: '1.2em' }}>
            Placement data has been hidden
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="placements-container" onClick={handleContainerClick}>
      <div className="placements-wrapper">
        {/* Overview */}
        <p className="survivor-overview">
          Track each player's performance across all their seasons
        </p>

        {/* Legend */}
        <div className="placements-legend">
          <div className="legend-item">
            <div className="legend-badge" style={{ backgroundColor: '#FFD700' }}>1</div>
            <span>Winner</span>
          </div>
          <div className="legend-item">
            <div className="legend-badge" style={{ backgroundColor: '#C0C0C0' }}>2</div>
            <span>Runner-up</span>
          </div>
          <div className="legend-item">
            <div className="legend-badge" style={{ backgroundColor: '#CD7F32' }}>3</div>
            <span>3rd Place</span>
          </div>
          <div className="legend-item">
            <div className="legend-badge" style={{ backgroundColor: palette.olive }}>4-5</div>
            <span>Top 5</span>
          </div>
          <div className="legend-item">
            <div className="legend-badge" style={{ backgroundColor: palette.slate }}>6-10</div>
            <span>Top 10</span>
          </div>
          <div className="sort-control">
            <label className="sort-label" htmlFor="placement-sort">Sort by:</label>
            <select
              id="placement-sort"
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
            >
              <option value="best">Best Placement</option>
              <option value="average">Average Placement</option>
              <option value="times">Times Played</option>
              <option value="tribe">Tribe</option>
              <option value="nameAsc">Name (A-Z)</option>
              <option value="nameDesc">Name (Z-A)</option>
            </select>
          </div>
        </div>

        {/* Players List */}
        <div className="placements-grid">
          {playersWithRanks.map((player, index) => {
            const tribeColor = palette[player.tribe.toLowerCase() as keyof typeof palette] || palette.ink;

            return (
              <div
                key={player.name}
                className={`placement-row`}
                style={{
                  animation: `fadeInUp 0.3s ease ${index * 0.02}s both`,
                  backgroundColor: tribeColor,
                  borderColor: 'var(--color-text)',
                }}
              >
                {/* Rank */}
                <div className="placement-rank" style={{ color: '#ffffff' }}>
                  {player.rank}
                </div>

                {/* Player Info */}
                <div className="placement-player-info">
                  <img
                    src={player.photo}
                    alt={player.name}
                    className="placement-photo"
                    style={{ borderColor: 'var(--color-text)' }}
                  />
                  <div className="placement-name-stats">
                    <div
                      className="placement-name"
                      style={{ color: '#ffffff' }}
                    >
                      {player.name.split(' ')[0]}
                    </div>
                    <div className="placement-meta" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      {player.timesPlayed} {player.timesPlayed === 1 ? 'season' : 'seasons'}
                      {player.wins > 0 && ` · ${player.wins} ${player.wins === 1 ? 'win' : 'wins'}`}
                    </div>
                  </div>
                </div>

                {/* Placements Timeline */}
                <div className="placements-timeline">
                  {player.seasons.map((season) => {
                    return (
                      <div
                        key={`${player.name}-${season.season}`}
                        className="timeline-item"
                        style={{
                          backgroundColor: getPlacementColor(season.placement),
                          borderColor: 'var(--color-text)',
                        }}
                      >
                        <div className="timeline-placement" style={{ color: season.placement <= 3 ? '#1A1A18' : '#ffffff' }}>
                          {season.placement}
                        </div>
                        <div className="timeline-season" style={{ color: season.placement <= 3 ? '#1A1A18' : '#ffffff' }}>
                          S{season.season}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Stats */}
                <div className="placement-stats">
                  <div className="stat-item">
                    <div className="stat-label" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Best</div>
                    <div
                      className="stat-value"
                      style={{ color: '#ffffff' }}
                    >
                      {player.bestPlacement}
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Avg</div>
                    <div className="stat-value" style={{ color: '#ffffff' }}>
                      {player.avgPlacement.toFixed(1)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
