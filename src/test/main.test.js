import { Ship } from '../ship';
import { Tile } from '../tile';
import { Gameboard } from '../gameboard';

// Tests Ship class
describe('Ship', () => {
  let ship;

  // Create a new ship of length 3 before each test
  beforeEach(() => {
    ship = new Ship('Destroyer', 3);
  });

  test('should be created with the correct name and length', () => {
    expect(ship.name).toBe('Destroyer');
    expect(ship.length).toBe(3);
  });

  test('should start with 0 hits', () => {
    expect(ship.hitCounter).toBe(0);
  });

  test('should not be sunk upon creation', () => {
    expect(ship.isSunk()).toBeFalsy();
  });

  test('hit() should increase hitCounter by 1', () => {
    ship.hit();
    expect(ship.hitCounter).toBe(1);
  });

  test('isSunk() should return false when hits are less than length', () => {
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBeFalsy();
  });

  test('isSunk() should return true when hits equal length', () => {
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBeTruthy();
  });

  test('isSunk() should return true when hits exceed length', () => {
    ship.hit();
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBeTruthy();
  });
});

// Tests Tile class
describe('Tile', () => {
  let tile;

  beforeEach(() => {
    tile = new Tile(5, 4);
  });

  test('should start with the correct coordinates', () => {
    expect(tile.getCoordinates()).toBe('5,4');
  });

  test('should start without being hit', () => {
    expect(tile.isHit()).toBeFalsy();
  });

  test('should start without a ship', () => {
    expect(tile.getShip()).toBeNull();
  });

  test('should start with state 0', () => {
    expect(tile.getState()).toBe(0)
  })

  test('attack() should set the tile as hit', () => {
    tile.attack();
    expect(tile.isHit()).toBeTruthy();
  });

  test('setShip() should add a ship to the tile', () => {
    let ship = new Ship('Cruiser', 3);
    tile.setShip(ship);
    expect(tile.getShip()).toEqual(ship);
  });

  test('hasShip should return false if tile has no ships', () => {
    expect(tile.hasShip()).toBeFalsy();
  });

  test('hasShip should return true if tile has a ship', () => {
    let ship = new Ship('Cruiser', 3);
    tile.setShip(ship);
    expect(tile.hasShip()).toBeTruthy();
  });

  test('setShip updates state correctly', () => {
    const mockShip = { name: 'Destroyer' };
    tile.setShip(mockShip);
    expect(tile.ship).toBe(mockShip);
    expect(tile.state).toBe(2);
  });

  test('attack updates state correctly', () => {
    tile.attack();
    expect(tile.hit).toBe(true);
    expect(tile.state).toBe(1);
  });

  test('attack on tile with ship updates state correctly', () => {
    const mockShip = { name: 'Destroyer' };
    tile.setShip(mockShip);
    tile.attack();
    expect(tile.hit).toBe(true);
    expect(tile.state).toBe(3);
  });
});

// Tests Gameboard class
describe('Gameboard', () => {
  let gameboard;

  // Create a new gameboard before each test
  beforeEach(() => {
    gameboard = new Gameboard();
  });

  test('initializeGrid should create a 2D array', () => {
    expect(Array.isArray(gameboard.grid)).toBe(true);
    expect(Array.isArray(gameboard.grid[0])).toBe(true);
    expect(gameboard.grid.length).toBe(10);
    expect(gameboard.grid[0].length).toBe(10);
  });

  test('getTile should return the correct tile', () => {
    const tile = gameboard.getTile(5, 5);
    expect(tile.row).toBe(5);
    expect(tile.column).toBe(5);
  });

  test('should initialize with correct number of ships', () => {
    expect(gameboard.ships.length).toBe(5); // 5 ships as defined in shipObjects
  });

  test('grid should contain Tile objects', () => {
    expect(gameboard.grid[0][0]).toBeInstanceOf(Tile);
    expect(gameboard.grid[9][9]).toBeInstanceOf(Tile);
  });

  test('ships should be Ship objects with correct properties', () => {
    const carrierShip = gameboard.ships.find((ship) => ship.name === 'Carrier');
    expect(carrierShip).toBeInstanceOf(Ship);
    expect(carrierShip.length).toBe(5);

    const patrolBoatShip = gameboard.ships.find(
      (ship) => ship.name === 'Patrol Boat'
    );
    expect(patrolBoatShip).toBeInstanceOf(Ship);
    expect(patrolBoatShip.length).toBe(2);
  });

  test('grid tiles should have correct coordinates', () => {
    expect(gameboard.grid[0][0].getCoordinates()).toBe('0,0');
    expect(gameboard.grid[9][9].getCoordinates()).toBe('9,9');
    expect(gameboard.grid[1][5].getCoordinates()).toBe('1,5');
  });

  test('placementList should be initialized with correct size', () => {
    expect(gameboard.placementList.size).toBe(100);
  });

  test('placementList should contain entries for each tile', () => {
    for (let i = 0; i < gameboard.rows; i++) {
      for (let j = 0; j < gameboard.columns; j++) {
        expect(gameboard.placementList.has(gameboard.grid[i][j])).toBeTruthy();
      }
    }
  });

  test('getShip should find the right ship', () => {
    const shipResult = gameboard.getShip('Destroyer');
    expect(shipResult.name).toBe('Destroyer');
  });
});

describe('-Gameboard Placement Mechanics', () => {
  let gameboard;

  beforeEach(() => {
    gameboard = new Gameboard();
  });

  test('corner tile should have two placement directions', () => {
    const cornerTile = gameboard.grid[0][0]; // Top-left corner
    const placements = gameboard.placementList.get(cornerTile);
    expect(placements.size).toBe(2); // Should have 'right' and 'down'
  });

  test('edge tile should have three placement directions', () => {
    const edgeTile = gameboard.grid[0][5]; // Top edge, not corner
    const placements = gameboard.placementList.get(edgeTile);
    expect(placements.size).toBe(3); // Should have 'left', 'right', and 'down'
  });

  test('center tile should have four placement directions', () => {
    const centerTile = gameboard.grid[4][4]; // A central tile
    const placements = gameboard.placementList.get(centerTile);
    expect(placements.size).toBe(4); // Should have all four directions
  });

  test('getPossiblePlacements should return correct placements for a ship', () => {
    const centerTile = gameboard.grid[4][4]; // A central tile
    const placements = gameboard.getPossiblePlacements(centerTile, 3);
    expect(placements[0].coordinates.length).toBe(3); // Should have 3 coordinates for a ship of length 3
  });

  test('placeShip should correctly place a ship', () => {
    const result = gameboard.placeShip('Destroyer', 0, 0, 'right');

    expect(result).toBe(true);

    expect(gameboard.getTile(0, 0).getShip().name).toBe('Destroyer');
    expect(gameboard.getTile(0, 1).getShip().name).toBe('Destroyer');
    expect(gameboard.getTile(0, 2).getShip().name).toBe('Destroyer');

    expect(gameboard.getTile(0, 3).getShip()).toBeNull();
  });

  test('placeShip should not place a ship on a direction that does not fit', () => {
    const result = gameboard.placeShip('Destroyer', 0, 0, 'left');

    expect(result).toBe(false);
  });

  test('placeShip should not place a ship on tiles that contain other ships', () => {
    gameboard.placeShip('Destroyer', 0, 0, 'right');
    const result = gameboard.placeShip('Submarine', 0, 1, 'down');

    expect(result).toBe(false);
  });

  test('getGrid returns grid', () => {
    expect(gameboard.getGrid()).toBe(gameboard.grid);
  })
});

// describe('-Gameboard Attack Mechanics', () => {
//   let gameboard;

//   beforeEach(() => {
//     gameboard = new Gameboard();
//     gameboard.placeShip('Destroyer', 0, 0, 'right');
//   });

//   test('receiveAttack should hit an empty tile', () => {
//     expect(gameboard.receiveAttack(5, 5)).toBe('Tile 5,5 attacked!');
//   });

//   test('receiveAttack should hit a ship', () => {
//     expect(gameboard.receiveAttack(0, 0)).toBe('Destroyer has been hit!');
//   });

//   test('receiveAttack should not hit the same tile twice', () => {
//     gameboard.receiveAttack(0, 0);
//     expect(gameboard.receiveAttack(0, 0)).toBe(
//       'Tile 0,0 has already been attacked!'
//     );
//   });

//   test('attackShip should sink a ship', () => {
//     const ship = gameboard.getShip('Destroyer');
//     ship.hit();
//     ship.hit();
//     expect(gameboard.attackShip(ship)).toBe('Destroyer has been sunk!');
//   });

//   test('checkForGameOver should return false when not all ships are sunk', () => {
//     expect(gameboard.checkForGameOver()).toBe(false);
//   });

//   test('checkForGameOver should return true when all ships are sunk', () => {
//     gameboard.ships.forEach((ship) => {
//       while (!ship.isSunk()) {
//         ship.hit();
//       }
//     });
//     expect(gameboard.checkForGameOver()).toBe(true);
//   });

//   test('Game should end when all ships are sunk', () => {
//     // Sink all ships except the last one
//     for (let i = 0; i < gameboard.ships.length - 1; i++) {
//       while (!gameboard.ships[i].isSunk()) {
//         expect(gameboard.attackShip(gameboard.ships[i])).not.toBe(
//           'Game Over! All ships have been sunk!'
//         );
//       }
//     }
//     // Get the last ship and leave it one hit from sinking.
//     const lastShip = gameboard.ships[gameboard.ships.length - 1];
//     while (lastShip.hitCounter < lastShip.length - 1) {
//       expect(gameboard.attackShip(lastShip)).not.toBe(
//         'Game Over! All ships have been sunk!'
//       );
//     }

//     // Check for game over
//     expect(gameboard.attackShip(lastShip)).toBe(
//       'Game Over! All ships have been sunk!'
//     );
//   });
// });
