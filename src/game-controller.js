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
    console.log(`%c${this.activePlayer.getName()}'s turn`, 'font-weight: bold')
    const enemy = this.getInactivePlayer();
    console.log(`${enemy.getName()}'s board`)
    enemy.gameboard.printGridWithoutShips();
    console.log(`${this.activePlayer.getName()}`)
    this.activePlayer.gameboard.printGridWithShips();
  }

  playRound(row, column) {
    const enemy = this.getInactivePlayer();
    const tie = enemy.gameboard.receiveAttack(row, column);

    if(enemy.gameboard.checkForGameOver()) {
      console.log(`Game Over! All of ${enemy.getName()}'s ships have been sunk!`)
      // Reset
    } else if (!tie) {
      this.switchPlayerTurn();
      this.printNewRound();
    }
  }


}
