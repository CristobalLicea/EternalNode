const { GRID_SIZE } = require('./gameUtils');

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
      },
      snake: [
        {x: 1, y: 10},
        {x: 2, y: 10},
        {x: 3, y: 10},
      ]
    },
    {
      pos: {
        x: 7,
        y: 5,
      },
      vel: {
        x: 1,
        y: 0,
      },
      snake: [
        {x: 1, y: 10},
        {x: 2, y: 10},
        {x: 3, y: 10},
      ]
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
  if(!state) {
    return;
  }

  const player1 = state.players[0];
  const player2 = state.players[1];

  player1.pos.x += player1.vel.x;
  player1.pos.y += player1.vel.y;
  player2.pos.x += player2.vel.x;
  player2.pos.y += player2.vel.y;

  if(player1.pos.x < 0 || player1.pos.x > GRID_SIZE || player1.pos.y < 0 || player1.pos.y > GRID_SIZE) {
    return 2;
  }

  if(player2.pos.x < 0 || player2.pos.x > GRID_SIZE || player2.pos.y < 0 || player2.pos.y > GRID_SIZE) {
    return 1;
  }

  if(state.food.x === player1.pos.x && state.food.y === player1.pos.y ) {
    player1.snake.push({...player1.pos})
    player1.pos.x += player1.vel.x;
    player1.pos.y += player1.vel.y;
    randomFood(state);
  }

  if(state.food.x === player2.pos.x && state.food.y === player2.pos.y ) {
    player2.snake.push({...player2.pos})
    player2.pos.x += player2.vel.x;
    player2.pos.y += player2.vel.y;
    randomFood(state);
  }

  if(player1.vel.x || player1.vel.y) {
    for (let cell of player1.snake) {
      if(cell.x === player1.pos.x && cell.y === player1.pos.y) {
        return 2;
      }
    }

    player1.snake.push({ ...player1.pos });
    player1.snake.shift();
  }

  if(player2.vel.x || player2.vel.y) {
    for (let cell of player2.snake) {
      if(cell.x === player2.pos.x && cell.y === player2.pos.y) {
        return 1;
      }
    }

    player2.snake.push({ ...player2.pos });
    player2.snake.shift();
  }

  return false;
}

const randomFood = (state) => {
  food = {
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE),
  }

  for(let cell of state.players[0].snake) {
    if(cell.x === food.x && cell.y === food.y) {
      return randomFood(state);
    }
  }

  for(let cell of state.players[1].snake) {
    if(cell.x === food.x && cell.y === food.y) {
      return randomFood(state);
    }
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
  }
}

const makeId = (length) => {
  let result = '';
  const characters = '0123456789';
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