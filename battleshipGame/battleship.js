const initBattleship = () => {
  let state = createBattleshipState();
  return state;
}

const createBattleshipState = (size = 10) => {
  let state = {
    players: [{
      name: '',
      board: [],
      nmeMap: [],
      unitCount: 5
    },
    {
      name: '',
      board: [],
      nmeMap: [],
      unitCount: 5
    }],
    size: size,
    phase: 'build',
    units: {
      two: 1,
      three: 2,
      four: 1,
      five: 1
    }
  }
  for (let i = 0; i < size; i++) {
    state.players[0].board[i] = [];
    state.players[1].board[i] = [];
    state.players[0].nmeMap[i] = [];
    state.players[1].nmeMap[i] = [];
    for (let j = 0; j < size; j++) {
      state.players[0].board[i][j] = { mark: '-', x: i, y: j, space: i + ' ' + j, occupied: false };
      state.players[1].board[i][j] = { mark: '-', x: i, y: j, space: i + ' ' + j, occupied: false }
      state.players[0].nmeMap[i][j] = { mark: '-', x: i, y: j, space: i + ' ' + j, occupied: false, firedAt: false }
      state.players[1].nmeMap[i][j] = { mark: '-', x: i, y: j, space: i + ' ' + j, occupied: false, firedAt: false }
    }
  }
  return state;
}

const placeUnits = () => {

}

const markSpace = (x, y, symbol, mapArr) => {
  boardArr[x][y] = symbol;
}

const attackSpace = (x, y, boardArr, mapArr) => {
  if (boardArr[x][y] == 'O') {
    markSpace(x, y, '!', mapArr)
  }
}

const battleshipLoop = (state) => {
  if (!state) {
    return;
  }

  const player1 = state.players[0];
  const player2 = state.players[1];

  if (player1.unitCount === 0) {
    return 2;
  }

  if (player2.unitCount === 0) {
    return 1;
  }
}

const makeBattleshipId = (n) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxy0123456789';
  const charactersLength = characters.length;

  for(let i = 0; i < n; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result;
}

module.exports = {
  initBattleship
}