export class ShipPlacementController {
  constructor(player, onPlacementComplete) {
    this.player = player;
    this.onPlacementComplete = onPlacementComplete;
    this.currentRotation = 'horizontal';
    this.ships = [
      { type: 'Carrier', length: 5, placed: false },
      { type: 'Battleship', length: 4, placed: false },
      { type: 'Destroyer', length: 3, placed: false },
      { type: 'Submarine', length: 3, placed: false },
      { type: 'Patrol Boat', length: 2, placed: false },
    ];
    this.currentDraggedShip = null;
    

    this.setUpEventListeners();
    this.renderShipDock();
    this.renderPlacementBoard();
  }

  setUpEventListeners() {
    // Rotate with 'r' or right click
    document.addEventListener('keydown', (e) => {
      if (e.key === 'r') this.toggleRotation();
    });

    document.addEventListener('contextmenu', (e) => {
      if (e.target.closest('.ship')) {
        e.preventDefault();
        this.toggleRotation();
      }
    });
  }

  toggleRotation() {
    this.currentRotation =
      this.currentRotation === 'horizontal' ? 'vertical' : 'horizontal';
    this.updateRotationDisplay();
  }

  updateRotationDisplay() {
    const display = document.getElementById('rotation-display');
    if (display) {
      const textNode = document.createTextNode(
        `Rotation: ${this.currentRotation}`
      );
      this.clearElement(display);
      display.appendChild(textNode);
    }
  }

  renderShipDock() {
    const dock = document.getElementById('ship-dock');
    this.clearElement(dock);

    // Create ships and add event listeners
    this.ships.forEach((ship) => {
      if (!ship.placed) {
        const shipElement = this.createShipElement(ship);
        dock.appendChild(shipElement);
      }
    });
  }

  createShipElement(ship) {
    const shipElement = document.createElement('div');
    shipElement.className = `placeship ship-${ship.type.toLowerCase()}`;
    shipElement.draggable = true;
    shipElement.setAttribute('data-ship-type', ship.type);
    shipElement.setAttribute('data-length', ship.length);

    for (let i = 0; i < ship.length; i++) {
      const tile = document.createElement('div');
      tile.className = 'placeship-cell';
      shipElement.appendChild(tile);
    }

    shipElement.addEventListener('dragstart', (e) =>
      this.handleDragStart(e, ship)
    );
    shipElement.addEventListener('dragend', (e) => this.handleDragEnd(e));

    return shipElement;
  }

  renderPlacementBoard() {
    const board = document.getElementById('placement-board');
    this.clearElement(board);

    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        const tile = this.createPlacementTile(row, col);
        board.appendChild(tile);
      }
    }
  }

  createPlacementTile(row, col) {
    const tile = document.createElement('div');
    tile.className = 'tile neutral';
    tile.setAttribute('data-row', row);
    tile.setAttribute('data-col', col);

    //Drop events
    tile.addEventListener('dragover', (e) => this.handleDragOver(e));
    tile.addEventListener('dragenter', (e) => this.handleDragEnter(e));
    tile.addEventListener('dragleave', (e) => this.handleDragLeave(e));
    tile.addEventListener('drop', (e) => this.handleDrop(e));

    return tile;
  }

  clearElement(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  handleDragStart(e, ship) {
    this.currentDraggedShip = ship;
    e.target.classList.add('dragging');

    e.dataTransfer.setData('text/plain', '');
    e.dataTransfer.effectAllowed = 'all';
  }

  handleDragEnd(e) {
    e.target.classList.remove('dragging');
    this.currentDraggedShip = null;
    this.clearHighlight();
  }

  handleDragOver(e) {
    e.preventDefault();
    if (!this.currentDraggedShip) return;

    const tile = e.target;
    const row = parseInt(tile.dataset.row);
    const col = parseInt(tile.dataset.col);

    this.highlightPlacementArea(row, col, this.currentDraggedShip.length);
  }

  handleDragEnter(e) {
    e.preventDefault();
  }

  handleDragLeave(e) {
    e.target.classList.remove('valid-placement', 'invalid-placement');
  }

  handleDrop(e) {
    e.preventDefault();
    if (!this.currentDraggedShip) return;

    const tile = e.target;
    const row = parseInt(tile.dataset.row);
    const col = parseInt(tile.dataset.col);
    
    const shipType = this.currentDraggedShip.type;

    if (this.isValidPlacement(row, col, this.currentDraggedShip.length)) {
      this.placeShip(shipType, row, col, this.currentDraggedShip.length);
      this.clearHighlight();

      this.currentDraggedShip.placed = true;
      this.renderShipDock();

      if (this.ships.every((s) => s.placed)) {
        this.onPlacementComplete();
      }
    }

    this.currentDraggedShip = null;
  }

  isValidPlacement(row, col, length) {
    const isHorizontal = this.currentRotation === 'horizontal';

    if (isHorizontal && col + length > 10) return false;
    if (!isHorizontal && row + length > 10) return false;

    for (let i = 0; i < length; i++) {
      const checkRow = isHorizontal ? row : row + i;
      const checkCol = isHorizontal ? col + i : col;
      if (this.player.gameboard.getGrid()[checkRow][checkCol].hasShip()) {
        return false;
      }
    }
    return true;
  }

  placeShip(shipType, row, col, length) {
    const direction = this.currentRotation === 'horizontal' ? 'right' : 'down';
    const isHorizontal = this.currentRotation === 'horizontal';

    for (let i = 0; i < length; i++) {
      const placedRow = isHorizontal ? row : row + i;
      const placedCol = isHorizontal ? col + i : col;
      
      const tile = document.querySelector(
        `[data-row='${placedRow}'][data-col='${placedCol}']`
      );

      tile.className = 'tile ship';
    }

    this.player.gameboard.placeShip(shipType, row, col, direction);
  }

  highlightPlacementArea(row, col, length) {
    this.clearHighlight();
    const isValid = this.isValidPlacement(row, col, length);
    const className = isValid ? 'valid-placement' : 'invalid-placement';

    const isHorizontal = this.currentRotation === 'horizontal';
    for (let i = 0; i < length; i++) {
      const highlightRow = isHorizontal ? row : row + i;
      const highlightCol = isHorizontal ? col + i : col;

      if (highlightRow < 10 && highlightCol < 10) {
        const tile = document.querySelector(
          `[data-row='${highlightRow}'][data-col='${highlightCol}']`
        );
        if (tile) {
          tile.classList.add(className);
        }
      }
    }
  }

  clearHighlight() {
    document.querySelectorAll('.tile').forEach((tile) => {
      tile.classList.remove('valid-placement', 'invalid-placement');
    });
  }


}
