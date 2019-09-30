const express = require('express');
const bodyParser = require('body-parser');
const socket = require('socket.io');
const config = require('../app.json');

const GameInstanceController = require('./controllers/GameInstanceController');
const ERROR = require('./ErrorHandling/ERROR');
const GAME_STATES = require('./utils/gameStates');

const { port } = config;
let GameInstances = new GameInstanceController(); // array of all active games

const app = express();

app.use(bodyParser.json());

app.get('/health', (req, res) => {
  res.send('working');
});

// ===== SOCKET.IO FROM HERE ON OUT ===== //

const io = socket(
  app.listen(port, () => console.log(`listening on port ${port}`))
);

// ===== This is where all of our socket 'endpoints' are going to be ===== //
io.on('connection', socket => {
  console.log(
    `Socket ${socket.id} has connected from address ${socket.handshake.address}.`
  );
  // TODO: if user was previously connected to a live game, reconnect them to the game

  // create (host) game
  socket.on('create game', createGame);
  async function createGame(playerName) {
    const current = GameInstances.createGameInstance(playerName, socket.id);
    const playerId = current.gameInstance.players[0].id;
    current.playerId = playerId;

    console.log(
      `Player ${current.playerId} is hosting game ${current.gameCode}`
    );

    socket.join(current.gameCode);
    socket.emit('created game', current);
  }

  // join existing game
  socket.on('join game', joinGame);
  async function joinGame(playerName, gameCode) {
    try {
      const current = GameInstances.findGameInstance(gameCode);

      if (current) {
        const player = current.gameInstance.addPlayer(
          null,
          playerName,
          socket.id
        );
        current.playerId = player.id;
        current.gameInstance.resetTimeout(); // start the timeout over since an action has been done

        console.log(
          `Player ${current.playerId} has joined game ${current.gameCode}`
        );

        socket.join(current.gameCode);
        io.in(current.gameCode).emit('joined game', current);
      } else {
        throw ERROR.GAME_NOT_FOUND;
      }
    } catch (err) {
      socket.emit('game error', err);
    }
  }

  // leave current game
  socket.on('leave game', leaveGame);
  function leaveGame([gameCode, playerId]) {
    console.log(`Player ${playerId} has left game ${gameCode}`);

    let current = GameInstances.findGameInstance(gameCode);

    current.gameInstance.removePlayer(playerId);

    current.gameInstance.resetTimeout(); // start the timeout over since an action has been done

    io.in(gameCode).emit('left game', current);
    socket.leave(gameCode);
  }

  // start game
  socket.on('start game', startGame);
  async function startGame(gameCode) {
    console.log('starting game', gameCode);
    let current = GameInstances.findGameInstance(gameCode);

    // only host can start game
    if (!current.gameInstance.players.find(player => player.id).isHost) {
      return socket.emit('game error', ERROR.ONLY_HOST_STARTS_GAME);
    }

    let startedGame = GameInstances.startGameInstance(current);

    const firstPlayer = startedGame.gameInstance.players[0];

    startedGame.gameState = GAME_STATES.STARTED;

    current.gameInstance.resetTimeout(); // start the timeout over since an action has been done

    console.log(
      `First player in game ${current.gameCode} is ${firstPlayer.id} - ${firstPlayer.name}`
    );

    await io.in(gameCode).emit('game started'); // let whole room the game has started
    io.in(gameCode).emit('new turn', firstPlayer.id); // let room know who whos turn it is
  }

  socket.on('finish turn', finishTurn);
  function finishTurn() {}

  // sends to everyone but original sender
  socket.on('broadcast message', input => {
    socket.broadcast.emit('generate response', input);
  });

  socket.on('blast message', input => {
    io.sockets.emit('generate response', input);
  });
});
