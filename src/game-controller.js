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
    return this.activePlayer === this.players[0]
      ? this.players[1]
      : this.players[0];
  }

  printNewRound() {
    console.log(`%c${this.activePlayer.getName()}'s turn`, "font-weight: bold");
    const enemy = this.getInactivePlayer();
    console.log(`${enemy.getName()}'s board`);
    enemy.gameboard.printGridWithoutShips();
    console.log(`${this.activePlayer.getName()}`);
    this.activePlayer.gameboard.printGridWithShips();
  }

  playRound(row, column) {
    // Get enemy player
    const enemy = this.getInactivePlayer();
    const tie = enemy.gameboard.receiveAttack(row, column);

    // Check for game over
    if (enemy.gameboard.checkForGameOver()) {
      console.log(
        `Game Over! All of ${enemy.getName()}'s ships have been sunk!`
      );
      return true;
    }
    // if not a tie
    else if (!tie && enemy.playerType !== "ai") {
      this.switchPlayerTurn();
      // this.printNewRound();
    }
    return false;
  }

  playAIRound() {
    // Get enemy player
    const player = this.getActivePlayer();
    let row, column;
    do {
      row = Math.floor(Math.random() * 10);
      column = Math.floor(Math.random() * 10);
    } while (player.gameboard.receiveAttack(row, column));

    // Check for game over
    if (player.gameboard.checkForGameOver()) {
      console.log(
        `Game Over! All of ${player.getName()}'s ships have been sunk!`
      );
      return true;
    } 
    return false;
  }

  resetGame() {
    const player1 = new Player(this.players[0].getName());
    const player2 = new Player(this.players[1].getName(), this.players[1].playerType);
    
    player1.setBoard();
    player2.setBoard();
    
    this.players = [player1, player2];
    this.activePlayer = this.players[0];
    
    return this;
  }
}
