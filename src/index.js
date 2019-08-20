const express = require("express");
const bodyParser = require("body-parser");
const socket = require("socket.io");
const config = require("../app.json");

const GameInstanceController = require("./controllers/GameInstanceController");
const GameController = require("./controllers/GameController");
const PlayerController = require("./controllers/PlayerController");

const { port, maxPlayers } = config;
let GameInstances = new GameInstanceController(); // array of all active games

const app = express();

app.use(bodyParser.json());

app.get("/health", (req, res) => {
  res.send("working");
});

// ===== SOCKET.IO FROM HERE ON OUT ===== //

const io = socket(
  app.listen(port, () => console.log(`listening on port ${port}`))
);

// ===== This is where all of our socket 'endpoints' are going to be ===== //
io.on("connection", socket => {
  console.log("connection made");
  // sends to just the original sender
  // create (host) game
  socket.on("create game", input => {
    const current = GameInstances.createGameInstance();

    console.log("CREATE GAME", current);
    socket.join(current.gameCode);
    socket.emit("created game", current);
  });

  // join existing game
  socket.on("join game", input => {
    console.log("input on joined game", input);
    const current = GameInstances.findGameInstance(input.gameCode);
    console.log("current", current);

    if (current) {
      current.gameInstance.addPlayer();

      console.log("joined game instance:", current);
      socket.join(current.gameCode);
    }

    socket.emit("joined game", JSON.stringify(current));
  });

  // sends to everyone but original sender
  socket.on("broadcast message", input => {
    socket.broadcast.emit("generate response", input);
  });

  socket.on("blast message", input => {
    io.sockets.emit("generate response", input);
  });

  // joins the specified room
  socket.on("join room", input => {
    socket.join(input.path.split("/")[1]);
  });

  // socket has disconnected
//   socket.on("disconnect", () => {
//     // set a timer to remove the player from a game if they don't reconnect within a certain amount of time
//     // the timer should cancel if the player reconnects
//     console.log("socket disconnecting");

//     socket.disconnect(0);
//   });
});
