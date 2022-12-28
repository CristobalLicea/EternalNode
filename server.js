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
const { initGame, gameLoop, getUpdatedVelocity, makeId } = require('./utils/slayer.js');
const { FRAME_RATE } = require('./utils/gameUtils');

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
    //origin: "https://project-eternal.netlify.app"
    origin: "http://localhost:3000"
  }
});

/*SocketIo*/
var typingUsers = {};
var state = {};
var clientRooms = {};

io.on('connection', (socket) => {
  console.log('A User has Connected');

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

  socket.on('keyDown', (key) => {
    const roomName = clientRooms[socket.id];

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
      state[roomName].players[socket.number - 1].vel = vel;
    }

  });

  socket.on('newGame', () => {

    let roomName = makeId(5);

    clientRooms[socket.id] = roomName;
    io.to(socket.id).emit('roomCode', roomName);

    state[roomName] = initGame();
    io.to(socket.id).emit('gameState',JSON.stringify(state[roomName]))

    socket.join(roomName);
    socket.number = 1;
    io.emit('init', 1);

    console.log(state[roomName])
  });

  socket.on('joinGame', (gameCode) => {
    const room = io.sockets.adapter.rooms[gameCode];
    console.log(gameCode)

    clientRooms[socket.id] = gameCode;
    socket.join(gameCode);
    socket.number = 2;
    io.emit('init', 2);

    const startGameInterval = (roomName) => {
      const intervalId = setInterval(() => {
        const winner = gameLoop(state[roomName]);
    
        if(!winner) {
          emitGameState(roomName, state[roomName])
        } else {
          emitGameOver(roomName, winner)
          clearInterval(intervalId);
          state[roomName] = initGame();
        }
      }, 1000 / FRAME_RATE);
    }

    const emitGameState = (roomName, state) => {
      io.sockets.in(roomName).emit('gameState', JSON.stringify(state));
    }

    const emitGameOver = (roomName, winner) => {
      io.sockets.in(roomName).emit('gameOver', JSON.stringify({winner}));
    }

    startGameInterval(gameCode);
  })
  
})

process.on('unhandledRejection', (err) => {
  console.log(`error: ${err.message}`);
  server.close(() => process.exit(1));
});