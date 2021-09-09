const BOAT_A = 'BOAT_A';
const BOAT_B = 'BOAT_B';
const BOAT_C = 'BOAT_C';
const BOAT_D = 'BOAT_D';
const BOAT_E = 'BOAT_E';

const BOATS_CONFIG = {
  [BOAT_A]: { color: 'yellow', squareCount: 2 },
  [BOAT_B]: { color: 'green', squareCount: 3 },
  [BOAT_C]: { color: 'greenyellow', squareCount: 3 },
  [BOAT_D]: { color: 'orange', squareCount: 4 },
  [BOAT_E]: { color: 'brown', squareCount: 5 },
};

const ALL_BOATS_ARRAY = [BOAT_A, BOAT_B, BOAT_C, BOAT_D, BOAT_E];

const BOAT_HORIZONTAL = 'HORIZONTAL';
const BOAT_VERTICAL = 'VERTICAL';

export default BOATS_CONFIG;

export { ALL_BOATS_ARRAY, BOAT_A, BOAT_B, BOAT_C, BOAT_D, BOAT_E, BOAT_HORIZONTAL, BOAT_VERTICAL };
