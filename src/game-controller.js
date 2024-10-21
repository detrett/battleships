class GameController {
  constructor(playerOne, playerTwo) {
    this.players = [playerOne, playerTwo];
    this.activePlayer = players[0];
  }

  switchPlayerTurn() {
    this.activePlayer =
      this.activePlayer === this.players[0] ? this.players[1] : this.players[0];
  }

  getActivePlayer() {
    return this.activePlayer;
  }

  printNewRound() {
    
  }

  playRound() {

  }
}
