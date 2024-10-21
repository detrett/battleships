export class GameController {
  constructor(playerOne, playerTwo) {
    this.players = [playerOne, playerTwo];
    this.activePlayer = this.players[0];
  }

  switchPlayerTurn() {
    this.activePlayer = this.getInactivePlayer();
  }

  getActivePlayer() {
    return this.activePlayer;
  }

  getInactivePlayer() {
    return this.activePlayer === this.players[0] ? this.players[1] : this.players[0];
  }

  printNewRound() {
    const enemy = this.getInactivePlayer();
    enemy.gameboard.printGridWithoutShips();
    this.activePlayer.gameboard.printGridWithShips();
  }

  playRound() {

  }
}
