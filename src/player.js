import { Gameboard } from "./gameboard";

export class Player {
  // Real or AI
  constructor(playerName, playerType = "real") {
    this.playerName = playerName;
    this.playerType = playerType;
    this.gameboard = new Gameboard();
  }

  getName() {
    return this.playerName;
  }

  setBoard() {
    const ships = [
      { name: "Carrier", length: 5 },
      { name: "Battleship", length: 4 },
      { name: "Destroyer", length: 3 },
      { name: "Submarine", length: 3 },
      { name: "Patrol Boat", length: 2 },
    ];

    ships.forEach((ship) => {
      let placed = false;

      // Keep trying until the ship is successfully placed
      while (!placed) {
        const direction = this.getRandomInt(2) === 0 ? "right" : "down";
        let row, col;

        if (direction === "right") {
          row = this.getRandomInt(10);
          col = this.getRandomInt(10 - ship.length);
        } else {
          row = this.getRandomInt(10 - ship.length);
          col = this.getRandomInt(10);
        }
        placed = this.gameboard.placeShip(ship.name, row, col, direction);
      }
    });
  }

  // Helper function to get a random number
  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
}
