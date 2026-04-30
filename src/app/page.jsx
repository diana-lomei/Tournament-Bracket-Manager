"use client";

import { useState, useCallback } from "react";
import TeamInput from "@/components/TeamInput";
import BracketView from "@/components/BracketView";
import { generateBracket } from "@/lib/bracketGenerator";
import { Team } from "@/models/Team";
import { Match } from "@/models/Match";

/**
 * Recursively clears the winner and the corresponding slot in subsequent rounds
 * when a previous match result is changed or cancelled.
 */
function clearDownstream(rounds, roundIndex, matchPosition) {
  if (roundIndex + 1 >= rounds.length) return;

  const nextRoundIndex = roundIndex + 1;
  const nextMatchPos = Math.floor(matchPosition / 2);
  const slot = Match.getSlot(matchPosition);
  const nextMatch = rounds[nextRoundIndex][nextMatchPos];

  // If the next match already has a winner, cascade the clear further down
  if (nextMatch.winnerId) {
    clearDownstream(rounds, nextRoundIndex, nextMatchPos);
  }

  nextMatch[slot] = null;
  nextMatch.winnerId = null;
}

export default function HomePage() {
  const [view, setView] = useState("input"); // "input" or "bracket"
  const [rounds, setRounds] = useState([]);

  //Generate bracket from team names
  const handleGenerate = useCallback((teamNames) => {
    const teams = Team.createTeams(teamNames);
    setRounds(generateBracket(teams));
    setView("bracket");
  }, []);

  //Select (or deselect) a match winner
  const handleSelectWinner = useCallback(
    (roundIndex, matchPosition, winnerId) => {
      setRounds((prev) => {
        // Deep copy the rounds array to preserve state immutability
        const next = prev.map((round) => round.map((m) => ({ ...m })));
        const match = next[roundIndex][matchPosition];

        // Toggle: clicking the same winner again cancels the selection
        if (match.winnerId === winnerId) {
          clearDownstream(next, roundIndex, matchPosition);
          match.winnerId = null;
          return next;
        }

        // Clear the old winner path before setting the new one
        clearDownstream(next, roundIndex, matchPosition);

        // Set the new winner
        match.winnerId = winnerId;

        // Advance the winner to the next round
        const winnerData =
          match.teamA?.id === winnerId ? match.teamA : match.teamB ?? null;

        if (winnerData && roundIndex + 1 < next.length) {
          const nextMatchPos = Math.floor(matchPosition / 2);
          const slot = Match.getSlot(matchPosition);
          next[roundIndex + 1][nextMatchPos][slot] = winnerData;
        }

        return next;
      });
    },
    []
  );

  //Reset to the team input screen
  const handleReset = useCallback(() => {
    setView("input");
    setRounds([]);
  }, []);

  //Determine the champion from the final match
  const champion = (() => {
    if (rounds.length === 0) return null;
    const finalMatch = rounds[rounds.length - 1][0];
    if (!finalMatch?.winnerId) return null;
    return finalMatch.teamA?.id === finalMatch.winnerId
      ? finalMatch.teamA
      : finalMatch.teamB ?? null;
  })();

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      {view === "input" ? (
        <TeamInput onGenerate={handleGenerate} />
      ) : (
        <BracketView
          rounds={rounds}
          champion={champion}
          onSelectWinner={handleSelectWinner}
          onReset={handleReset}
        />
      )}
    </main>
  );
}