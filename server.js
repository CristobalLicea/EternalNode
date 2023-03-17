const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const cors = require('cors');
const errorHandler = require('./middleware/error');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const socket = require('socket.io');
const Message = require('./models/Message');
const { initGame, gameLoop, getUpdatedVelocity, makeId } = require('./snakeGame/snake.js');
const { initBattleship } = require('./battleshipGame/battleship');
const { FRAME_RATE } = require('./snakeGame/gameUtils');

//Routes
const auth = require('./routes/auth');
const post = require('./routes/post');
const s3 = require('./routes/s3');
const room = require('./routes/room');
const message = require('./routes/message');

dotenv.config({ path:'./config/config.env' });

connectDB();

const PORT = process.env.PORT || 5987;

const app = express();
app.use(express.json());
app.use(cookieParser());


if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
};

app.use(cors());
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/v1/auth', auth);
app.use('/api/v1/post', post);
app.use('/api/v1/s3', s3);
app.use('/api/v1/rooms', room);
app.use('/api/v1/message', message);

app.use(errorHandler);

app.get('/', (req, res) => {
  res.send("Hello! From Cristobal's Bookstagram, we are listening. :)");
});

const server = app.listen(
  PORT,
  console.log(`Server Running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

const io = socket(server, {
  cors: {
    //origin: "http://localhost:3000"
    //origin: "https://codercristobalsocial.netlify.app"
    origin: "*"
  }
});

/*SocketIo*/
var typingUsers = {};
var snakeState = {};
var snakeRooms = {};
let battleshipRooms = {};
let battleshipState = {};

io.on('connection', (socket) => {
  console.log('A User has Connected');

  //Chat functions
  socket.on("startType", (user, roomId) => {
    console.log(user + " is writing a message...");
    typingUsers[user] = roomId;
    io.emit("userTypingUpdate", typingUsers, roomId);
  });

  socket.on("stopType", (user) =>{
    console.log(user + " has stopped writing a message...");
    delete typingUsers[user];
    io.emit("userTypingUpdate", typingUsers);
  });

  socket.on('newMessage', (message, author, roomId, authorId) => {
    //Create message

    console.log(message);

    let newMessage = new Message({
      message: message,
      roomId: roomId,
      authorId: authorId,
      author: author
  });
    //Save it to database
    newMessage.save(function(err, msg){
      //Send message to those connected in the room
      console.log('new message sent');

      io.emit("messageCreated",  msg.message, msg.roomId, msg.authorId, msg.author);
    });
  });

  //Snake functions
  socket.on('newGame', () => {

    let roomName = makeId(5);

    snakeRooms[socket.id] = roomName;
    io.to(socket.id).emit('roomCode', roomName);

    snakeState[roomName] = initGame();
    io.to(socket.id).emit('gameState',JSON.stringify(snakeState[roomName]))

    socket.join(roomName);
    socket.number = 1;
    io.emit('init', 1);

    console.log(snakeState[roomName])
  });

  socket.on('joinGame', (gameCode) => {
    console.log(gameCode)

    snakeRooms[socket.id] = gameCode;
    socket.join(gameCode);
    socket.number = 2;
    io.emit('init', 2);

    const startGameInterval = (roomName) => {
      const intervalId = setInterval(() => {
        const winner = gameLoop(snakeState[roomName]);
    
        if(!winner) {
          emitGameState(roomName, snakeState[roomName])
        } else {
          emitGameOver(roomName, winner)
          clearInterval(intervalId);
          snakeState[roomName] = initGame();
        }
      }, 1000 / FRAME_RATE);
    }

    const emitGameState = (roomName, snakeState) => {
      io.sockets.in(roomName).emit('gameState', JSON.stringify(snakeState));
    }

    const emitGameOver = (roomName, winner) => {
      io.sockets.in(roomName).emit('gameOver', JSON.stringify({winner}));
    }

    startGameInterval(gameCode);
  })

  socket.on('keyDown', (key) => {
    const roomName = snakeRooms[socket.id];

    if(!roomName) {
      return;
    }

      try {
        key = parseInt(key)
      } catch(e) {
        console.log(e);
        return;
      }

    const vel = getUpdatedVelocity(key);

    if(vel) {
      snakeState[roomName].players[socket.number - 1].vel = vel;
    }

  });

  //battleship functions
  socket.on('newBattleshipGame', (name) => {
    let roomName = makeId(6);
    socket.number = 0;

    battleshipRooms[socket.id] = roomName;
    io.to(socket.id).emit('battleshipCode', roomName);

    battleshipState[roomName] = initBattleship();
    battleshipState[roomName].players[socket.number].name = name;
    io.to(socket.id).emit('battleshipState', JSON.stringify(battleshipState[roomName].players[socket.number]))
    socket.join(roomName);
  })

  socket.on('joinBattleshipGame', (data) => {
    data = JSON.parse(data);
    battleshipRooms[socket.id] = data.code;
    socket.join(data.code);
    console.log(data.code + 'hello')
    socket.number = 1;

    //battleshipState[data.code].players[socket.number].name = data.name;

    //io.to(socket.id).emit('battleshipState', JSON.stringify(battleshipState[gameCode].players[socket.number]));

    //setTimeout(() => {
    //  io.sockets.in(roomName).emit('battleshipPlace', JSON.stringify(battleshipState[gameCode].units))
    //}, 1000);

    /*const emitBattleshipState = (roomName, battleshipState) => {
      io.sockets.in(roomName).emit('battleshipState', JSON.stringify(battleshipState));
    }
    const emitBattleshipGameover = (roomName, winner) => {
      io.sockets.in(roomName).emit('battleshipGameOver', JSON.stringify({winner}));
    }*/
  })

  socket.on('updateBattleshipState', (state) => {
    const room = battleshipRooms[socket.id]
    state = JSON.parse(state)
    if (!room) {
      return
    }

    if (state) {
      battleshipState[room].players[socket.number] = state
      if (socket.number === 0) {
        battleshipState[room].player1HasPlaced = true;
      } else if (socket.number === 1) {
        battleshipState[room].player2HasPlaced = true;
      }
    }

    if (battleshipState[room].player2HasPlaced && battleshipState[room].player1HasPlaced) {
      battleshipState[room].phase = 'fire';
      console.log('firing');
      io.sockets.in(room).emit('chooseTarget', 'choose target');
    }
  })
})

process.on('unhandledRejection', (err) => {
  console.log(`error: ${err.message}`);
  server.close(() => process.exit(1));
});
