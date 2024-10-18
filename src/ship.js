export class Ship {
  constructor(name, length) {
    this.name = name;
    this.length = length;
    this.hitCounter = 0;
    this.sunk = false;
  }

  hit() {
    this.hitCounter++;
  }

  isSunk() {
    if (this.hitCounter >= this.length) {
      this.sunk = true;
    }
    return this.sunk;
  }
}
