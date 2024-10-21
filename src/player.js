import { Gameboard } from "./gameboard";

export class Player {
  // Real or AI
  constructor(playerType) {
    this.playerType = playerType;
    this.gameboard = new Gameboard();
  }
}