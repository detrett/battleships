import { Tile } from "./tile";
import { Ship } from "./ship";

export class Gameboard {
  rows = 10;
  columns = 10;
  shipObjects = [
    { name: "Carrier", length: 5 },
    { name: "Battleship", length: 4 },
    { name: "Destroyer", length: 3 },
    { name: "Submarine", length: 3 },
    { name: "Patrol Boat", length: 2 },
  ];

  constructor() {
    this.grid = this.initializeGrid();
    this.ships = this.initializeShips();
    this.placementList = this.initializePlacementList();

    this.addPlacements();
  }

  initializeGrid() {
    const grid = [];
    for (let i = 0; i < this.rows; i++) {
      grid[i] = [];
      for (let j = 0; j < this.columns; j++) {
        grid[i].push(new Tile(i, j));
      }
    }
    return grid;
  }

  initializeShips() {
    let ships = [];
    this.shipObjects.forEach((ship) => {
      ships.push(new Ship(ship.name, ship.length));
    });
    return ships;
  }

  initializePlacementList() {
    let placementList = new Map();
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        placementList.set(this.grid[i][j], new Set());
      }
    }
    return placementList;
  }

  getShip(name) {
    return this.ships.find((ship) => ship.name === name);
  }

  getTile(row, col) {
    return this.grid[row][col];
  }

  receiveAttack(row, col) {
    const tile = this.getTile(row, col);
    if (!tile.isHit()) {
      tile.attack();
      if (tile.hasShip()) {
        const ship = tile.getShip();
        return this.attackShip(ship);
      } else {
        return `Tile ${tile.getCoordinates()} attacked!`;
      }
    } else {
      return `Tile ${tile.getCoordinates()} has already been attacked!`;
    }
  }

  attackShip(ship) {
    ship.hit();
    if (ship.isSunk()) {
      if (this.checkForGameOver()) {
        return "Game Over! All ships have been sunk!";
      }
      return `${ship.name} has been sunk!`;
    }
    return `${ship.name} has been hit!`;
  }

  checkForGameOver() {
    return this.ships.every((ship) => ship.isSunk());
  }

  placeShip(shipName, row, col, direction) {
    const ship = this.getShip(shipName);
    const tile = this.getTile(row, col);

    const placementCoordinates = this.checkShipPlacement(ship, tile, direction);
    if (placementCoordinates.length > 0) {
      placementCoordinates.forEach(([r, c]) => {
        this.getTile(r, c).setShip(ship);
      });
      return true;
    }
    return false;
  }

  // Helper function that returns the coordinates for placement
  checkShipPlacement(ship, tile, direction) {
    const placements = this.getPossiblePlacements(tile, ship.length);

    let placementCoordinates = [];

    placements.forEach((placement) => {
      if (placement.direction === direction) {
        if (this.checkAvailability(placement.coordinates)) {
          placementCoordinates = placement.coordinates;
        }
      }
    });

    return placementCoordinates;
  }

  // Helper function that returns true if no ships are in the tiles passed
  checkAvailability(coordinatesArray) {
    return coordinatesArray.every(([row, col]) => {
      const tile = this.getTile(row, col);
      return tile.getShip() === null;
    });
  }

  // Adds possible placement options for each tile
  addPlacements() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.columns; col++) {
        const tile = this.grid[row][col];
        this.checkDirection(
          tile,
          "left",
          (r, c) => [r, c - 1],
          (r, c) => c >= 0
        );
        this.checkDirection(
          tile,
          "up",
          (r, c) => [r - 1, c],
          (r, c) => r >= 0
        );
        this.checkDirection(
          tile,
          "right",
          (r, c) => [r, c + 1],
          (r, c) => c < this.columns
        );
        this.checkDirection(
          tile,
          "down",
          (r, c) => [r + 1, c],
          (r, c) => r < this.rows
        );
      }
    }
  }

  // Helper function to determine max distance up to 5 spaces in a direction of a tile
  // nextCoordsFn: Function to determine the next coordinates
  // boundaryCheckFn: Function to determine if we have exceeded the boards' boundaries
  checkDirection(tile, direction, nextCoordsFn, boundaryCheckFn) {
    let [r, c] = [tile.row, tile.column];
    let distance = 0;
    let placements = [];

    while (distance < 5 && boundaryCheckFn(r, c)) {
      [r, c] = nextCoordsFn(r, c);
      distance++;

      if (boundaryCheckFn(r, c)) {
        placements.push([r, c]);
      } else {
        break;
      }
    }

    if (placements.length > 0) {
      if (!this.placementList.has(tile)) {
        this.placementList.set(tile, new Set());
      }
      const placementSet = this.placementList.get(tile);
      placementSet.add({ direction, placements });
    }
  }

  // Possible placements for a ship at a specific tile
  getPossiblePlacements(tile, shipLength) {
    if (!this.placementList.has(tile)) {
      return [];
    }
    
    const placementSet = this.placementList.get(tile);
    const possiblePlacements = [];

    placementSet.forEach(({ direction, placements }) => {
      if (placements.length >= shipLength - 1) {
        possiblePlacements.push({
          direction,
          coordinates: [
            [tile.row, tile.column],
            ...placements.slice(0, shipLength - 1),
          ],
        });
      }
    });

    return possiblePlacements;
  }

  printBoard() {}
}
