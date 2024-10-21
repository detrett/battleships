export class Tile {
  constructor(row, column) {
    this.row = row;
    this.column = column;
    this.coordinates = [row,column];
    this.hit = false;
    this.ship = null;
    // 0: Neutral
    // 1: Hit
    // 2: Ship
    // 3: Hit + Ship
    this.state = 0;
  }

  getCoordinates() {
    return `${this.row},${this.column}`;
  }

  attack() {
    this.hit = true;
    this.state = this.ship ? 3 : 1;
  }

  isHit() {
    return this.hit;
  }

  setShip(ship) {
    this.ship = ship;
    this.state = 2;
  }

  hasShip() {
    return this.ship === null ? false : true;
  }

  getShip() {
    return this.ship;
  }

  setState(state) {
    this.state = state;
  }

  getState() {
    return this.state;
  }
}