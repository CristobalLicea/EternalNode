const { GRID_SIZE } = require('../snakeGame/gameUtils');

const initGame = () => {
  const state = createGameState();
  randomFood(state);
  return state;
}

const createGameState = () => {
  return {
    players: [{
      pos: {
        x: 3,
        y: 10,
      },
      vel: {
        x: 1,
        y: 0,
      }
    }],
    food: {
      x: 7,
      y: 7,
    },
    gridSize: GRID_SIZE,
    active: true
  }
}

const gameLoop = (state) => {
  console.log(state)
  if(!state) {
    return;
  }

  const player1 = state.players[0];

  player1.pos.x += player1.vel.x;
  player1.pos.y += player1.vel.y;

  if(state.food.x === player1.pos.x && state.food.y === player1.pos.y ) {
    player1.pos.x += player1.vel.x;
    player1.pos.y += player1.vel.y;
    randomFood(state);
  }

  return false;
}

const randomFood = (state) => {
  const player1 = state.players[0];
  food = {
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE),
  }

  if(player1.pos.x === food.x && player1.pos.y === food.y) {
    return randomFood(state);
  }

  
  state.food = food;
}

const getUpdatedVelocity = (key) => {
  switch(key) {
    case 37: {
      return { x: -1, y: 0 };
    }
    case 38: {
      return { x: 0, y: -1 };
    }
    case 39: {
      return { x: 1, y: 0 };
    }
    case 40: {
      return { x: 0, y: 1 };
    }
    case 0: {
      return { x: 0, y: 0 };
    }
  }
}

const makeId = (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxy0123456789';
  const charactersLength = characters.length;

  for(let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result;
}

module.exports = {
  initGame,
  gameLoop,
  getUpdatedVelocity,
  makeId
};