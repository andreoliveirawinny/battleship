import React from 'react';
// import './App.css';
import { map, range, times, forEach } from 'lodash';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import BOATS_CONFIG, {
  ALL_BOATS_ARRAY, BOAT_A, BOAT_B, BOAT_C, BOAT_D, BOAT_E, BOAT_HORIZONTAL, BOAT_VERTICAL
} from './constants/boats';
import SQUARE_SIZES from './constants/square';
import helpers from './helpers';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

const createID = (l, n) => `${l}${n}`;

const SQUARE_COLOR = {
  0: 'white',
  1: 'grey',
  2: 'pink'
};

const Square = ({
  id, l, n, onSelect, hasBoat, boatType, boatDirection, selectedType, dropBoatAt
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: [BOAT_A, BOAT_B, BOAT_C, BOAT_D, BOAT_E],
    drop: droppedBoat => { console.log(id, l, n, droppedBoat.id); dropBoatAt(droppedBoat.id, l, n); },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    })
  }), [dropBoatAt, l, n])

  return (
    <div
      ref={drop}
      onClick={() => onSelect(l, n)}
      style={{
        textAlign: 'center',
        width: SQUARE_SIZES.WIDTH,
        height: SQUARE_SIZES.HEIGHT,
        border: '1px solid grey',
        backgroundColor: hasBoat ? BOATS_CONFIG[boatType].color : (selectedType ? SQUARE_COLOR[selectedType] : SQUARE_COLOR[0])
      }}
    >
      
    </div>
  );
};

const NumbersRow = () => (
  <div style={{ display: 'flex' }}>
    {map(range(11), n => (
      <div key={n} style={{ textAlign: 'center', width: '4em', height: '3em', border: '1px solid grey' }}>
        <strong>{n > 0 ? n : null}</strong>
      </div>
    ))}
  </div>
);

const Letter = ({ letter }) => (
  <div style={{ textAlign: 'center', width: '4em',border: '1px solid grey' }}>
    <strong>{letter}</strong>
  </div>
);

/**
 * BoatsConfig
 */

const BoatConfig = ({ type, direction, toggleDirection }) => {
  const [{isDragging}, drag] = useDrag(() => ({
    type,
    item: {
      id: type
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  })); 

  return (
    <div>
      <div
        key={type}
        ref={drag}
        className="flex items-center justify-center border"
        style={{ width: '25em', height: '25em', border: isDragging ? '4px solid black' : '' }}
      > 
        <div className="flex flex-column">
          <div className={`flex ${(!direction || direction === BOAT_HORIZONTAL) ? '' : 'flex-column'}`}>
            {map(range(BOATS_CONFIG[type].squareCount), n => (
              <div
                key={n}
                className="border"
                style={{
                  width: SQUARE_SIZES.WIDTH, height: SQUARE_SIZES.HEIGHT, minWidth: SQUARE_SIZES.WIDTH, backgroundColor: BOATS_CONFIG[type].color
                }}
              >
              </div>
            ))}
          </div>

        </div>
      </div>

      <button style={{ width: '100%', height: '8em' }} onClick={() => toggleDirection(type)}>Rotate</button>
    </div>
  );
};

const BoatsConfig = ({ boatsGameConfig, toggleDirection }) => {
  return (
    <div className="flex p2">
      {map(ALL_BOATS_ARRAY, boatType => <BoatConfig
        type={boatType}
        direction={boatsGameConfig[boatType].direction}
        toggleDirection={toggleDirection}
        />
      )}
    </div>
  );
};

const createBoatPositionInBoard = (boatId, position, l, n) => {
  const { squareCount } = BOATS_CONFIG[boatId];

  if(!position || position === BOAT_HORIZONTAL) {
    return times(squareCount, iteratorNumber => ({ l, n: n + iteratorNumber }))
  } else {
    console.log('times(squareCount, () => ({ l: helpers.getNextLetter(l), n })', l, times(squareCount, () => ({ l: helpers.getNextLetter(l), n })));
    return times(squareCount, iteratorNumber => ({ l: iteratorNumber === 0 ? l : helpers.getNextLetter(l, iteratorNumber), n }));
  }
};

const getBoatGameConfigForPosition = (boatsGameConfig, currentL, currentN, n) => {
  let boatType;
  let boatDirection; 

  forEach(
    boatsGameConfig,
    ({ positions, direction }, type) => {
      forEach(positions, ({ l: boatPositionLetter, n: boatPositionNumber }) => {
        if(boatPositionLetter === currentL && boatPositionNumber === currentN) {
          boatType = type;
          boatDirection = direction;

          return false;
        }
      });

      // stop loop ealier if possible
      if(boatType && boatDirection) return false;
    }
  );

  return { boatType, boatDirection };
};

function App() {
  const [selected, setSelected] = React.useState({});

  const [boatsGameConfig, setBoatGameConfig] = React.useState({
    [BOAT_A]: { positions: [], direction: BOAT_HORIZONTAL },
    [BOAT_B]: { positions: [], direction: BOAT_HORIZONTAL },
    [BOAT_C]: { positions: [], direction: BOAT_HORIZONTAL },
    [BOAT_D]: { positions: [], direction: BOAT_HORIZONTAL },
    [BOAT_E]: { positions: [], direction: BOAT_HORIZONTAL }
  });

  const toggleDirection = boatType => {
    setBoatGameConfig({
      ...boatsGameConfig,
      [boatType]: { ...boatsGameConfig[boatType], direction: helpers.toggleBoatDirection(boatsGameConfig[boatType].direction)}
    });
  };

  const onSelect = (l, n, type) => {
    const id = createID(l, n);

    const currentValue = selected[id];
    
    if(!currentValue) {
      setSelected({
        ...selected,
        [id]: 1
      });
    } else if(currentValue === 1) {
      setSelected({
        ...selected,
        [id]: 2
      });
    } else {
      setSelected({
        ...selected,
        [id]: 0
      });
    }
  };

  console.log('Boat Positions:', boatsGameConfig);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <header className="App-header">

          <NumbersRow />
          
          {map(LETTERS, l => (
            <div key={l} style={{ display: 'flex' }}>
              <Letter letter={l} />

              {map(range(1, 11), n => {                
                const { boatType, boatDirection } = getBoatGameConfigForPosition(boatsGameConfig, l, n);
                
                return (
                  <Square
                    onSelect={onSelect}
                    key={createID(l, n)} id={createID(l, n)} n={n} l={l}
                    selectedType={selected[createID(l, n)]}
                    selected={!!selected[createID(l, n)]}
  
                    dropBoatAt={(boatId, l, n) => {
                      console.log('dropAT>', boatId);
                      console.log('boatsGameConfig', boatsGameConfig);

                      setBoatGameConfig({
                        ...boatsGameConfig,
                        [boatId]: { ...boatsGameConfig[boatId], positions: createBoatPositionInBoard(boatId, boatsGameConfig[boatId].direction, l, n)}
                      })
                    }}
  
                    hasBoat={!!boatType}
                    boatType={boatType}
                    boatDirection={boatDirection}
                  />
                );
              })}
            </div>
          ))}

          <BoatsConfig boatsGameConfig={boatsGameConfig} toggleDirection={toggleDirection} />
        </header>
      </div>
    </DndProvider>
  );
}

export default App;
