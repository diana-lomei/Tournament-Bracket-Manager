import { Team } from "./Team";

/**
 * Match class with business logic
 */
export class Match {
  constructor(
    round,
    position,
    teamA = null,
    teamB = null,
    id = null
  ) {
    // Generate an ID if one is not provided
    this.id = id ?? `match_r${round}_p${position}`;
    this.round = round;
    this.position = position;
    this.teamA = teamA;
    this.teamB = teamB;
    this.winnerId = null;
  }

  /** Current match status */
  get status() {
    if (this.winnerId) return "completed";
    if (!this.teamA && !this.teamB) return "upcoming";
    if (!this.teamA || !this.teamB) return "bye";
    return "ready";
  }

  /** Whether this match is a bye (one team is missing) */
  isBye() {
    return !!this.teamA !== !!this.teamB;
  }

  /** Returns the winner's data object */
  getWinner() {
    if (!this.winnerId) return null;
    if (this.teamA?.id === this.winnerId) return this.teamA;
    if (this.teamB?.id === this.winnerId) return this.teamB;
    return null;
  }

  /**
   * Determines which slot ('teamA' or 'teamB') the winner will fill in the next round.
   * Even position → teamA, odd position → teamB
   */
  static getSlot(position) {
    return position % 2 === 0 ? "teamA" : "teamB";
  }

  /** Serializes the class instance to a plain data object (for React state) */
  toData() {
    return {
      id: this.id,
      round: this.round,
      position: this.position,
      teamA: this.teamA,
      teamB: this.teamB,
      winnerId: this.winnerId,
    };
  }

  /** Restores a Match class instance from plain data */
  static fromData(data) {
    const m = new Match(data.round, data.position, data.teamA, data.teamB, data.id);
    m.winnerId = data.winnerId;
    return m;
  }
}
