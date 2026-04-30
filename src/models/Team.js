// ─── Team class with business logic ──────────────────────────────────────────
export class Team {

  constructor(name, seed, id) {
    this.id = id ?? `team_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    this.name = name;
    this.seed = seed;
  }

  getDisplayName() {
    return `#${this.seed} ${this.name}`;
  }

  toData() {
    return { 
      id: this.id, 
      name: this.name, 
      seed: this.seed 
    };
  }

  static fromData(data) {
    return new Team(data.name, data.seed, data.id);
  }

  static createTeams(names) {
    return names.map((name, i) => new Team(name, i + 1).toData());
  }
}