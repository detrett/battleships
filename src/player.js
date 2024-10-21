import { Gameboard } from "./gameboard";

export class Player {
  // Real or AI
  constructor(playerType) {
    this.playerType = playerType;
    this.gameboard = new Gameboard();
  }

  setBoard() {
    this.gameboard.placeShip("Carrier", 0, 0, "right");
    this.gameboard.placeShip("Battleship", 2, 5, "down");
    this.gameboard.placeShip("Destroyer", 3, 9, "left");
    this.gameboard.placeShip("Submarine", 7, 6, "down");
    this.gameboard.placeShip("Patrol Boat", 9, 0, "up");
  }
}