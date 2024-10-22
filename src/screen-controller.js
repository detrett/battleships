import { GameController } from "./game-controller";
import { Player } from "./player";
import { ShipPlacementController } from "./ship-placement-controller";

export class ScreenController {
  constructor() {
    this.setupPlacementPhase();
    this.gameController = null;
    this.playerTurnDiv = document.getElementById("player-turn");
    this.enemyBoardDiv = document.getElementById("enemy-board");
    this.playerBoardDiv = document.getElementById("player-board");
    this.resetButton = document.getElementById("reset-button");
    if (this.resetButton) {
      this.resetButton.addEventListener("click", () => this.resetGame());
    }
  }

  setupPlacementPhase() {
    const player1 = new Player("Player 1");
    const player2 = new Player("Player 2", "ai");

    player2.setBoard();

    new ShipPlacementController(player1, () => {
      this.gameController = new GameController(player1, player2);
      this.startGame();
    })

  }

  startGame() {
    document.querySelector('.placement-container').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';

    this.enemyBoardDiv.addEventListener("click", (event) =>
      this.clickHandlerBoard(event)
    );
    this.enableBoardClicks();
    this.updateScreen();
  }

  updateScreen() {
    // Clear grids
    this.enemyBoardDiv.textContent = "";
    this.playerBoardDiv.textContent = "";

    // Get updated grids
    const enemy = this.gameController.getInactivePlayer();
    const enemyGrid = enemy.gameboard.getGrid();
    const activePlayer = this.gameController.getActivePlayer();
    const playerGrid = activePlayer.gameboard.getGrid();

    // Set player turn
    this.playerTurnDiv.textContent = `${activePlayer.getName()}'s turn...`;

    // Update grids
    this.updateGrid(this.enemyBoardDiv, enemyGrid, false);
    this.updateGrid(this.playerBoardDiv, playerGrid, true);
  }

  // Helper method to update grids
  updateGrid(div, grid, showShips) {
    grid.forEach((row, r_index) =>
      row.map((tile, c_index) => {
        let element = "span";
        if (!showShips) {
          element = "button";
        }
        const tileEl = document.createElement(element);
        tileEl.classList.add("tile");
        tileEl.dataset.row = r_index;
        tileEl.dataset.column = c_index;

        switch (tile.getState()) {
          case 0:
            tileEl.classList.add("neutral");
            break;
          case 1:
            tileEl.classList.add("miss");
            break;
          case 2:
            if (showShips) {
              tileEl.classList.add("ship");
            } else {
              tileEl.classList.add("neutral");
            }
            break;
          case 3:
            tileEl.classList.add("hit");
            break;
        }

        div.appendChild(tileEl);
      })
    );
  }

  clickHandlerBoard(event) {
    const selectedRow = event.target.dataset.row;
    const selectedColumn = event.target.dataset.column;

    if (!selectedColumn || !selectedRow) return;

    const isGameOver = this.gameController.playRound(
      selectedRow,
      selectedColumn
    );
    this.updateScreen();

    if (isGameOver) {
      this.handleGameOver();
      return;
    }

    // VS AI
    if (this.gameController.getInactivePlayer().playerType === "ai") {
      this.disableBoardClicks();
      setTimeout(() => {
        const isAIgameOver = this.gameController.playAIRound();
        this.updateScreen();

        if (isAIgameOver) {
          this.handleGameOver();
        } else {
          this.enableBoardClicks();
        }
      }, 500);
    }
  }
  // Disables clicks on the board
  disableBoardClicks() {
    this.enemyBoardDiv.style.pointerEvents = "none";
  }
  // Enables clicks on the board
  enableBoardClicks() {
    this.enemyBoardDiv.style.pointerEvents = "auto";
  }

  resetGame() {
    document.querySelector('.placement-container').style.display = 'flex';
    document.getElementById('game-container').style.display = 'none';

    this.setupPlacementPhase();
  }

  handleGameOver() {
    this.disableBoardClicks();
    const winner = this.gameController.getInactivePlayer().getName();
    this.playerTurnDiv.textContent = `Game Over! ${winner} wins!`;

    setTimeout(() => {
      if (confirm("Game Over! Would you like to play again?")) {
        this.resetGame();
      }
    }, 100);
  }
}
