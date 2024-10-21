import { GameController } from "./game-controller";
import { Player } from "./player";

export class ScreenController {
  constructor() {
    this.gameController = this.initialize();
    this.playerTurnDiv = document.getElementById("player-turn");
    this.enemyBoardDiv = document.getElementById("enemy-board");
    this.playerBoardDiv = document.getElementById("player-board");

    this.enemyBoardDiv.addEventListener("click", (event) =>
      this.clickHandlerBoard(event)
    );

    this.updateScreen();
  }

  initialize() {
    const player1 = new Player("Player 1");
    const player2 = new Player("Player 2", "ai");

    player1.setBoard();
    player2.setBoard();

    return new GameController(player1, player2);
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

    console.log(selectedRow + selectedColumn);
    this.gameController.playRound(selectedRow, selectedColumn);
    this.updateScreen();

    // VS AI
    if (this.gameController.getInactivePlayer().playerType === "ai") {
      this.disableBoardClicks();
      setTimeout(() => {
        this.gameController.playAIRound();
        this.updateScreen();
        this.enableBoardClicks();
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
}
