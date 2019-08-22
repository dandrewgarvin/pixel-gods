const express = require('express');
const bodyParser = require('body-parser');
const socket = require('socket.io');
const config = require('../app.json');

const GameInstanceController = require('./controllers/GameInstanceController');
const ERROR = require('./ErrorHandling/ERROR');

const { port, maxPlayers } = config;
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
  console.log('connection made');
  // if user was previously connected to a live game, reconnect them to the game

  // create (host) game
  socket.on('create game', playerName => {
    const current = GameInstances.createGameInstance(playerName);
    console.log('instances:', GameInstances.instances.length);

    console.log('CREATE GAME', current.gameCode);
    socket.join(current.gameCode);
    socket.emit('created game', current);
  });

  // join existing game
  socket.on('join game', (playerName, gameCode) => {
    try {
      console.log('input on joined game', playerName, gameCode);
      const current = GameInstances.findGameInstance(gameCode);
      console.log('current', current);

      if (current) {
        current.gameInstance.addPlayer('red', playerName);
        current.gameInstance.resetTimeout(); // start the timeout over since an action has been done

        console.log('joined game instance:', current.gameInstance);
        socket.join(current.gameCode);
        socket.emit('joined game', current);
      } else {
        throw ERROR.GAME_NOT_FOUND;
      }
    } catch (err) {
      console.log('err', err);
      socket.emit('game error', err);
    }
  });

  // leave current game
  socket.on('leave game', (gameCode, playerId) => {
    console.log('gameCode', gameCode);
    console.log('playerId', playerId);

    let current = GameInstances.findGameInstance(gameCode);
    console.log('current', current);

    current.removePlayer(playerId);

    console.log('current after player removal', current);

    socket.leave(gameCode);
    socket.to(gameCode).emit('left game');
  });

  socket.on('start game', gameCode => {});

  // sends to everyone but original sender
  socket.on('broadcast message', input => {
    socket.broadcast.emit('generate response', input);
  });

  socket.on('blast message', input => {
    io.sockets.emit('generate response', input);
  });

  // joins the specified room
  socket.on('join room', input => {
    socket.join(input.path.split('/')[1]);
  });

  // socket has disconnected
  //   socket.on("disconnect", () => {
  //     // set a timer to remove the player from a game if they don't reconnect within a certain amount of time
  //     // the timer should cancel if the player reconnects
  //     console.log("socket disconnecting");

  //     socket.disconnect(0);
  //   });
});
