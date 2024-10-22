export class ShipPlacementController {
  constructor(player, onPlacementComplete) {
    this.player = player;
    this.onPlacementComplete = onPlacementComplete;
    this.currentRotation = "horizontal";
    this.ships = [
      { type: 'Carrier', length: 5, placed: false },
      { type: 'Battleship', length: 4, placed: false },
      { type: 'Destroyer', length: 3, placed: false },
      { type: 'Submarine', length: 3, placed: false },
      { type: 'Patrol Boat', length: 2, placed: false }
    ];

    this.setUpEventListeners();
    this.renderShipDock();
    this.renderPlacementBoard();
  }

  setUpEventListeners() {
    // Rotate with 'r' or right click
    document.addEventListener('keydown', (e => {
      if (e.key === 'r') this.toggleRotation();
    }));

    document.addEventListener('contextmenu', (e) => {
      if (e.target.closest('ship')) {
        e.preventDefault();
        this.toggleRotation();
      }
    })
  }

  toggleRotation() {
    this.currentRotation = this.currentRotation === 'horizontal' ? 'vertical' : 'horizontal';
  }

  renderShipDock() {
    const dock = document.getElementById('ship-dock');
    dock.innerHTML = '';

    
  }

}