import { GameController } from './game-controller';
import { Player } from './player';

export class ScreenController {
  constructor() {
    this.gameController = this.initialize();
    this.playerTurnDiv = document.getElementById('player-turn');
    this.enemyBoardDiv = document.getElementById('enemy-board');
    this.playerBoardDiv = document.getElementById('player-board');
  }

  initialize() {
    const player1 = new Player('Player 1');
    const player2 = new Player('Player 2');

    player1.setBoard();
    player2.setBoard();

    return new GameController(player1, player2);
  }

  updateScreen() {
    // Clear grids
    this.enemyBoardDiv.textContent = '';
    this.playerBoardDiv.textContent = '';

    // Get updated grids
    const enemy = this.gameController.getInactivePlayer();
    const enemyGrid = enemy.gameboard.getGrid();
    const activePlayer = this.gameController.getActivePlayer();
    const playerGrid = activePlayer.gameboard.getGrid();

    // Set player turn
    this.playerTurnDiv.textContent = `${activePlayer.getName()}'s turn...`;

    // Update grids
    this.updateGrid(this.enemyBoardDiv, enemyGrid);
    this.updateGrid(this.playerBoardDiv, playerGrid)
  }

  // Helper method to update grids
  updateGrid(div, grid) {
    grid.forEach((row, r_index) =>
      row.map((tile, c_index) => {
        const tileButton = document.createElement('button');
        tileButton.classList.add('tile');
        tileButton.dataset.row = r_index;
        tileButton.dataset.column = c_index;

        switch (tile.getState()) {
          case 0:
            tileButton.classList.add('neutral');
            break;
          case 1:
            tileButton.classList.add('miss');
            break;
          case 2:
            tileButton.classList.add('ship');
            break;
          case 3:
            tileButton.classList.add('hit');
            break;
        }

        div.appendChild(tileButton);
      })
    );
  }
}
