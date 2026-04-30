"use client";

import { useState, useRef } from "react";
import { nextPowerOfTwo } from "@/lib/bracketGenerator";

/** Example teams for quick testing */
const EXAMPLES = [
  "Manchester City", "Real Madrid", "Bayern Munich", "PSG",
  "Liverpool", "Barcelona", "Juventus", "Chelsea",
];

const MAX_TEAMS = 32;

export default function TeamInput({ onGenerate }) {
  const [value, setValue] = useState("");
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  /** Adds a new team to the list with validation */
  const addTeam = () => {
    const name = value.trim();
    if (!name) {
      setError("Please enter a team name");
      return;
    }
    if (teams.some((t) => t.toLowerCase() === name.toLowerCase())) {
      setError(`"${name}" is already in the list`);
      return;
    }
    if (teams.length >= MAX_TEAMS) {
      setError(`Maximum ${MAX_TEAMS} teams allowed`);
      return;
    }

    setTeams((p) => [...p, name]);
    setValue("");
    setError("");
    inputRef.current?.focus();
  };

  /** Removes a team by index */
  const removeTeam = (i) => {
    setTeams((p) => p.filter((_, idx) => idx !== i));
    setError("");
  };

  /** Handle Enter key press */
  const handleKey = (e) => {
    if (e.key === "Enter") addTeam();
  };

  /** Validate minimum count and generate the bracket */
  const handleGenerate = () => {
    if (teams.length < 2) {
      setError("Please add at least 2 teams");
      return;
    }
    onGenerate(teams);
  };

  // Calculate bracket size (next power of two)
  const slots = teams.length >= 2 ? nextPowerOfTwo(teams.length) : 0;
  const byes = slots - teams.length;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-950">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="text-7xl mb-4">🏆</div>
        <h1 className="text-4xl font-bold text-white mb-2">Tournament Manager</h1>
        <p className="text-gray-400 text-lg">Add your teams and generate the bracket</p>
      </div>

      <div className="w-full max-w-md">
        {/* Input row */}
        <div className="flex gap-2 mb-2">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => { setValue(e.target.value); setError(""); }}
            onKeyDown={handleKey}
            placeholder="Team name..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-colors"
          />
          <button
            onClick={addTeam}
            className="bg-pink-500 hover:bg-pink-600 active:scale-95 text-white font-bold text-xl px-5 rounded-lg transition-all"
          >
            +
          </button>
        </div>

        {/* Error message */}
        {error && <p className="text-red-400 text-sm mb-2">{error}</p>}

        {/* Meta information row */}
        <div className="flex justify-between items-center mb-4 text-sm">
          <span className="text-gray-500">{teams.length} / {MAX_TEAMS} teams</span>
          <button
            onClick={() => { setTeams(EXAMPLES); setError(""); }}
            className="text-pink-400 hover:text-pink-300 underline transition-colors"
          >
            Load example
          </button>
        </div>

        {/* Team scrollable list */}
        {teams.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 mb-5 max-h-64 overflow-y-auto">
            <div className="space-y-1.5">
              {teams.map((team, i) => (
                <div
                  key={`${team}-${i}`}
                  className="flex items-center justify-between bg-gray-800 rounded-lg px-3 py-2"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-pink-400 font-mono text-xs w-5 text-center">
                      {i + 1}
                    </span>
                    <span className="text-white text-sm">{team}</span>
                  </div>
                  <button
                    onClick={() => removeTeam(i)}
                    aria-label={`Remove ${team}`}
                    className="text-gray-600 hover:text-red-400 transition-colors text-xl leading-none"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action button */}
        <button
          onClick={handleGenerate}
          disabled={teams.length < 2}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
            teams.length >= 2
              ? "bg-pink-500 hover:bg-pink-600 active:scale-95 text-white shadow-lg shadow-pink-500/25"
              : "bg-gray-800 text-gray-600 cursor-not-allowed"
          }`}
        >
          {teams.length < 2
            ? "Add at least 2 teams"
            : `Generate Bracket (${teams.length} teams)`}
        </button>

        {/* Hint about byes */}
        {slots > 0 && (
          <p className="text-center text-gray-600 text-xs mt-3">
            Bracket size: {slots} slots
            {byes > 0 && ` • ${byes} ${byes === 1 ? "bye" : "byes"}`}
          </p>
        )}
      </div>
    </div>
  );
}