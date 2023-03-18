const initBattleship = () => {
  let state = createBattleshipState();
  return state;
}

const createBattleshipState = (size = 10) => {
  let state = {
    players: [{
      name: '',
      nmeName: '',
      board: [],
      nmeMap: [],
      unitCount: 0
    },
    {
      name: '',
      nmeName: '',
      board: [],
      nmeMap: [],
      unitCount: 0
    }],
    size: size,
    phase: 'build',
    units: {
      1: 10,
      2: 2
    },
    player1HasPlaced: false,
    player2HasPlaced: false
  }
  for (let i = 0; i < size; i++) {
    state.players[0].board[i] = [];
    state.players[1].board[i] = [];
    state.players[0].nmeMap[i] = [];
    state.players[1].nmeMap[i] = [];
    for (let j = 0; j < size; j++) {
      state.players[0].board[i][j] = { mark: '-', x: i, y: j, space: i + ' ' + j, occupied: false, hit: false };
      state.players[1].board[i][j] = { mark: '-', x: i, y: j, space: i + ' ' + j, occupied: false, hit: false }
      state.players[0].nmeMap[i][j] = { mark: '-', x: i, y: j, space: i + ' ' + j, occupied: false, firedAt: false }
      state.players[1].nmeMap[i][j] = { mark: '-', x: i, y: j, space: i + ' ' + j, occupied: false, firedAt: false }
    }
  }
  return state;
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