export class Tile {
  constructor(row, column) {
    this.row = row;
    this.column = column;
    this.coordinates = [row,column];
    this.hit = false;
    this.ship = null;
  }

  getCoordinates() {
    return `${this.row},${this.column}`;
  }

  attack() {
    this.hit = true;
  }

  isHit() {
    return this.hit;
  }

  setShip(ship) {
    this.ship = ship;
  }

  hasShip() {
    return this.ship === null ? false : true;
  }

  getShip() {
    return this.ship;
  }
}