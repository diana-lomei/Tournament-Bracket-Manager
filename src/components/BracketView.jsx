"use client";

import MatchCard from "./MatchCard";
import { getRoundName } from "@/lib/bracketGenerator";

// Visual constants
const SLOT_HEIGHT = 96;   // px per match "slot" in first round
const CONNECTOR_W = 44;   // px wide connector between rounds
const LABEL_H = 36;       // px for round label (h-6 + mb-3)

/** SVG bezier curves connecting matches across two adjacent rounds */
function BracketConnector({ fromCount, toCount, height }) {
  return (
    <svg
      width={CONNECTOR_W}
      height={height}
      className="shrink-0"
      style={{ display: "block" }}
    >
      {Array.from({ length: fromCount }, (_, i) => {
        const y1 = ((i + 0.5) / fromCount) * height;
        const y2 = ((Math.floor(i / 2) + 0.5) / toCount) * height;
        const cx = CONNECTOR_W / 2;
        return (
          <path
            key={i}
            d={`M 0 ${y1} C ${cx} ${y1} ${cx} ${y2} ${CONNECTOR_W} ${y2}`}
            stroke="#374151"
            strokeWidth="1.5"
            fill="none"
          />
        );
      })}
    </svg>
  );
}

export default function BracketView({ rounds, champion, onSelectWinner, onReset }) {
  if (rounds.length === 0) return null;

  const totalRounds = rounds.length;
  const firstRoundCount = rounds[0].length;
  const columnHeight = firstRoundCount * SLOT_HEIGHT;

  const allMatches = rounds.flat();
  const completedCount = allMatches.filter((m) => m.winnerId).length;
  const totalCount = allMatches.length;
  const progress = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="min-h-screen flex flex-col bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-gray-900/90 backdrop-blur border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏆</span>
          <div>
            <h1 className="text-lg font-bold text-white leading-none">Tournament Bracket</h1>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="w-28 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-pink-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-gray-500">
                {completedCount}/{totalCount} matches
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={onReset}
          className="text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-4 py-2 rounded-lg transition-colors"
        >
          ← New Tournament
        </button>
      </header>

      {/* Champion banner */}
      {champion && (
        <div className="bg-gradient-to-r from-amber-950/50 via-pink-950/50 to-amber-950/50 border-b border-amber-700/30 py-3 text-center">
          <p className="text-amber-300 font-bold text-lg">
            🏆 Champion:{" "}
            <span className="text-white">{champion.name}</span>
          </p>
        </div>
      )}

      {/* Bracket canvas */}
      <div className="flex-1 overflow-auto p-8">
        <div className="flex items-start">
          {rounds.map((round, ri) => (
            <div key={ri} className="flex items-start">
              {/* Round column */}
              <div style={{ width: 192 }}>
                {/* Label */}
                <div className="text-center mb-3 h-6 flex items-center justify-center">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-gray-500">
                    {getRoundName(ri, totalRounds)}
                  </span>
                </div>
                {/* Matches */}
                <div
                  className="flex flex-col justify-around"
                  style={{ height: columnHeight }}
                >
                  {round.map((match, mi) => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      onSelectWinner={(wid) => onSelectWinner(ri, mi, wid)}
                    />
                  ))}
                </div>
              </div>

              {/* Connector SVG */}
              {ri < rounds.length - 1 && (
                <div style={{ marginTop: LABEL_H }}>
                  <BracketConnector
                    fromCount={round.length}
                    toCount={rounds[ri + 1].length}
                    height={columnHeight}
                  />
                </div>
              )}
            </div>
          ))}

          {/* Champion slot */}
          {champion && (
            <div style={{ width: 160 }}>
              <div style={{ height: LABEL_H }} />
              <div
                className="flex items-center justify-center"
                style={{ height: columnHeight }}
              >
                <div className="bg-gradient-to-br from-amber-900/50 to-pink-900/50 border border-amber-600/40 rounded-2xl p-6 text-center">
                  <div className="text-5xl mb-2">🏆</div>
                  <p className="text-amber-400 text-xs font-semibold mb-0.5">
                    #{champion.seed}
                  </p>
                  <p className="text-white font-bold">{champion.name}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-800/60 py-3 text-center">
        <p className="text-xs text-gray-600">
          Click a team to select the winner • Click again to undo
        </p>
      </div>
    </div>
  );
}
