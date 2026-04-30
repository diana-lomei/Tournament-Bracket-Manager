import { Match } from "@/models/Match";

/** Finds the smallest power of two that is >= n */
function nextPowerOfTwo(n) {
  let p = 1;
  while (p < n) p *= 2;
  return p;
}

function getSeededOrder(numSlots) {
  if (numSlots === 1) return [1];
  const half = numSlots / 2;
  const prev = getSeededOrder(half);
  const result = [];
  for (const seed of prev) {
    result.push(seed);
    result.push(numSlots + 1 - seed);
  }
  return result;
}

/**
 * Generates a single-elimination tournament bracket.
 *
 * @param {Array} teams - List of teams sorted by ranking
 * @returns {Array} rounds - Array of rounds, each containing an array of matches
 */
export function generateBracket(teams) {
  if (teams.length < 2) {
    throw new Error("At least 2 teams are required");
  }

  const numSlots = nextPowerOfTwo(teams.length);
  const numRounds = Math.log2(numSlots);

  // Distribute teams into slots according to seeding; extra slots → null (bye)
  const seedOrder = getSeededOrder(numSlots);
  const slots = seedOrder.map((seed) => teams[seed - 1] ?? null);

  const rounds = [];

  // Round 0 (first round) 
  const firstRound = [];
  for (let i = 0; i < numSlots / 2; i++) {
    const match = new Match(0, i, slots[i * 2], slots[i * 2 + 1]);
    firstRound.push(match.toData());
  }
  rounds.push(firstRound);

  // Subsequent rounds (empty placeholders) 
  for (let r = 1; r < numRounds; r++) {
    const count = numSlots / Math.pow(2, r + 1);
    const round = Array.from({ length: count }, (_, i) =>
      new Match(r, i).toData()
    );
    rounds.push(round);
  }

  // Auto-advance byes in round 0
  firstRound.forEach((matchData, i) => {
    const match = Match.fromData(matchData);
    if (match.isBye()) {
      const winner = matchData.teamA ?? matchData.teamB;
      if (winner && rounds.length > 1) {
        matchData.winnerId = winner.id;
        const nextMatchPos = Math.floor(i / 2);
        const slot = Match.getSlot(i); // Returns 'teamA' or 'teamB'
        rounds[1][nextMatchPos][slot] = winner;
      }
    }
  });

  return rounds;
}

/** Returns the round name in English */
export function getRoundName(roundIndex, totalRounds) {
  const fromEnd = totalRounds - 1 - roundIndex;
  switch (fromEnd) {
    case 0: return "Final";
    case 1: return "Semifinal";
    case 2: return "Quarterfinal";
    default: return `Round ${roundIndex + 1}`;
  }
}

export { nextPowerOfTwo };
