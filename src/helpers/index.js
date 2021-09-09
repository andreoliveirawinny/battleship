import { BOAT_HORIZONTAL, BOAT_VERTICAL } from "../constants/boats"

const helpers = {
  toggleBoatDirection: currentDirection => (!currentDirection || currentDirection === BOAT_HORIZONTAL) ? BOAT_VERTICAL : BOAT_HORIZONTAL,
  getNextLetter: (currentLetter, increment = 1) => String.fromCharCode(currentLetter.charCodeAt(0) + increment)
};

export default helpers;