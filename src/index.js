import "./styles.css";

import { GameController } from "./game-controller";
import { Player } from "./player";

const player1 = new Player("real");
const player2 = new Player("ai");

player1.setBoard();
player2.setBoard();

const gameController = new GameController(player1, player2);


gameController.printNewRound();