const attractions = ['carousel', 'prize'];

// Money/progress is owned here, never by render or by the replayable puzzles.
// A paid activity lasts until its story succeeds; failed attempts are free.
export class Visit {
  constructor() {
    this.tickets = 0;
    this.issued = 0;
    this.spent = 0;
    this.active = {carousel: false, prize: false};
    this.completed = {carousel: 0, prize: 0};
    this.selected = null;
    this.lastPlayAt = null;
    this.lastAwardAt = null;
    this.tokenAt = null;
  }

  award(completedBoothStories, time) {
    if (completedBoothStories <= this.issued) return false;
    this.tickets += completedBoothStories - this.issued;
    this.issued = completedBoothStories;
    this.lastAwardAt = time;
    return true;
  }

  canPlay(name) {
    return attractions.includes(name) && (this.active[name] || this.tickets > 0);
  }

  play(name, time, action) {
    if (!this.canPlay(name)) return false;
    // The model validates the action before a new payment is committed.
    // Both are synchronous; no intermediate render can spend a second ticket.
    if (!action()) return false;
    if (!this.active[name]) {
      this.tickets--;
      this.spent++;
      this.active[name] = true;
    }
    this.selected = name;
    this.lastPlayAt = time;
    return true;
  }

  complete(name, stories, time) {
    if (!attractions.includes(name) || !this.active[name] || stories <= this.completed[name]) return false;
    this.completed[name] = stories;
    this.active[name] = false;
    if (this.tokenAt === null && attractions.every(key => this.completed[key] > 0)) this.tokenAt = time;
    return true;
  }

  snapshot() {
    return {admitted: this.issued > 0, admissionTickets: this.tickets, ticketsIssued: this.issued, ticketsSpent: this.spent,
      carouselUnlocked: this.issued > 0, prizeUnlocked: this.issued > 0,
      active: {...this.active}, completed: {...this.completed}, selected: this.selected,
      lastPlayAt: this.lastPlayAt, lastAwardAt: this.lastAwardAt,
      souvenirTokens: this.tokenAt === null ? 0 : 1, tokenAt: this.tokenAt};
  }
}
