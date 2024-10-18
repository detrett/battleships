import { Ship } from "../ship";
import { Tile } from "../tile";
import { Gameboard } from "../gameboard";

// Tests Ship class
describe("Ship", () => {
  let ship;

  // Create a new ship of length 3 before each test
  beforeEach(() => {
    ship = new Ship("Destroyer", 3);
  });

  test("should be created with the correct name and length", () => {
    expect(ship.name).toBe("Destroyer");
    expect(ship.length).toBe(3);
  });

  test("should start with 0 hits", () => {
    expect(ship.hitCounter).toBe(0);
  });

  test("should not be sunk upon creation", () => {
    expect(ship.isSunk()).toBeFalsy();
  });

  test("hit() should increase hitCounter by 1", () => {
    ship.hit();
    expect(ship.hitCounter).toBe(1);
  });

  test("isSunk() should return false when hits are less than length", () => {
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBeFalsy();
  });

  test("isSunk() should return true when hits equal length", () => {
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBeTruthy();
  });

  test("isSunk() should return true when hits exceed length", () => {
    ship.hit();
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBeTruthy();
  });
});

// Tests Tile class
describe("Tile", () => {
  let tile;

  beforeEach(() => {
    tile = new Tile(5, 4);
  });

  test("should start with the correct coordinates", () => {
    expect(tile.getCoordinates()).toBe("5,4");
  });

  test("should start without being hit", () => {
    expect(tile.isHit()).toBeFalsy();
  });

  test("should start without a ship", () => {
    expect(tile.getShip()).toBeNull();
  });

  test("attack() should set the tile as hit", () => {
    tile.attack();
    expect(tile.isHit()).toBeTruthy();
  });

  test("setShip() should add a ship to the tile", () => {
    let ship = new Ship("Cruiser", 3);
    tile.setShip(ship);
    expect(tile.getShip()).toEqual(ship);
  });
});

// Tests Gameboard class
describe("Gameboard", () => {
  let gameboard;

  // Create a new gameboard before each test
  beforeEach(() => {
    gameboard = new Gameboard();
  });

  test("should start with the correct grid size", () => {
    expect(gameboard.grid.length).toBe(100);
  });

  test("should initialize with correct number of ships", () => {
    expect(gameboard.ships.length).toBe(5); // 5 ships as defined in shipObjects
  });

  test("grid should contain Tile objects", () => {
    expect(gameboard.grid[0]).toBeInstanceOf(Tile);
    expect(gameboard.grid[99]).toBeInstanceOf(Tile);
  });

  test("ships should be Ship objects with correct properties", () => {
    const carrierShip = gameboard.ships.find((ship) => ship.name === "Carrier");
    expect(carrierShip).toBeInstanceOf(Ship);
    expect(carrierShip.length).toBe(5);

    const patrolBoatShip = gameboard.ships.find(
      (ship) => ship.name === "Patrol Boat"
    );
    expect(patrolBoatShip).toBeInstanceOf(Ship);
    expect(patrolBoatShip.length).toBe(2);
  });

  test('grid tiles should have correct coordinates', () => {
    expect(gameboard.grid[0].getCoordinates()).toBe('0,0');
    expect(gameboard.grid[99].getCoordinates()).toBe('9,9');
    expect(gameboard.grid[15].getCoordinates()).toBe('1,5');
  });

  test('placementList should be initialized with correct size', () => {
    expect(gameboard.placementList.size).toBe(100);
  });

  test('placementList should contain entries for each tile', () => {
    gameboard.grid.forEach(tile => {
      expect(gameboard.placementList.has(tile)).toBeTruthy();
    });
  });

  test('placementList entries should be initialized as empty Sets', () => {
    gameboard.placementList.forEach((value, key) => {
      expect(value).toBeInstanceOf(Set);
      expect(value.size).toBe(0);
    });
  });
});

describe('Gameboard Placement Mechanics', () => {
  let gameboard;

  beforeEach(() => {
    gameboard = new Gameboard();
    gameboard.addPlacements();
  });

  test('corner tile should have two placement directions', () => {
    const cornerTile = gameboard.grid[0];  // Top-left corner
    const placements = gameboard.placementList.get(cornerTile);
    expect(placements.size).toBe(2);  // Should have 'right' and 'down'
  });

  test('edge tile should have three placement directions', () => {
    const edgeTile = gameboard.grid[5];  // Top edge, not corner
    const placements = gameboard.placementList.get(edgeTile);
    expect(placements.size).toBe(3);  // Should have 'left', 'right', and 'down'
  });

  test('center tile should have four placement directions', () => {
    const centerTile = gameboard.grid[44];  // A central tile
    const placements = gameboard.placementList.get(centerTile);
    expect(placements.size).toBe(4);  // Should have all four directions
  });

  test('getPossiblePlacements should return correct placements for a ship', () => {
    const centerTile = gameboard.grid[44];  // A central tile
    const placements = gameboard.getPossiblePlacements(centerTile, 3);
    expect(placements[0].coordinates.length).toBe(3);  // Should have 3 coordinates for a ship of length 3
  });
});
