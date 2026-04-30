"use client";

/** Determines the match status based on available data */
function getStatus(m) {
  if (m.winnerId) return "completed";
  if (!m.teamA && !m.teamB) return "upcoming";
  if (!m.teamA || !m.teamB) return "bye";
  return "ready";
}

/** Renders an individual team slot inside a match card */
function TeamSlot({ team, isWinner, isLoser, placeholder, clickable, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={!clickable}
      className={[
        "w-full flex items-center gap-2 px-3 py-2.5 text-left transition-all duration-150 select-none",
        clickable && !isWinner ? "hover:bg-gray-700/60 cursor-pointer" : "cursor-default",
        isWinner ? "bg-pink-500/20" : "",
      ].join(" ")}
    >
      {team ? (
        <>
          <span className="text-[10px] text-gray-500 font-mono w-5 text-right shrink-0">
            {team.seed}
          </span>
          <span
            className={[
              "flex-1 text-sm truncate",
              isWinner ? "text-pink-300 font-semibold" : "text-gray-200",
              isLoser ? "text-gray-600 line-through" : "",
            ].join(" ")}
          >
            {team.name}
          </span>
          {isWinner && (
            <span className="text-pink-400 text-xs shrink-0 font-bold">✓</span>
          )}
        </>
      ) : (
        <span className="pl-7 text-xs italic text-gray-600">{placeholder}</span>
      )}
    </button>
  );
}

/** Main match card component */
export default function MatchCard({ match, onSelectWinner }) {
  const status = getStatus(match);
  const canClick = status === "ready" || status === "completed";

  const isWinnerA = !!match.teamA && match.teamA.id === match.winnerId;
  const isWinnerB = !!match.teamB && match.teamB.id === match.winnerId;
  const hasWinner = !!match.winnerId;

  const placeholder = status === "bye" ? "BYE" : "TBD";

  return (
    <div
      className={[
        "w-48 border rounded-lg overflow-hidden bg-gray-900 shrink-0",
        status === "completed" ? "border-pink-900/60" : "border-gray-700/50",
        status === "upcoming" ? "opacity-50" : "",
      ].join(" ")}
    >
      <TeamSlot
        team={match.teamA}
        isWinner={isWinnerA}
        isLoser={hasWinner && !isWinnerA && !!match.teamA}
        placeholder={placeholder}
        clickable={canClick && !!match.teamA}
        onClick={() => match.teamA && onSelectWinner(match.teamA.id)}
      />
      <div className="h-px bg-gray-800" />
      <TeamSlot
        team={match.teamB}
        isWinner={isWinnerB}
        isLoser={hasWinner && !isWinnerB && !!match.teamB}
        placeholder={placeholder}
        clickable={canClick && !!match.teamB}
        onClick={() => match.teamB && onSelectWinner(match.teamB.id)}
      />
    </div>
  );
}