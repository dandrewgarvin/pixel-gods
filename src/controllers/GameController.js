const config = require('../../app.json');
const PlayerController = require('./PlayerController');

class GameController {
  constructor(
    playerName,
    playerId,
    handleTimeout,
    removeGameInstance,
    gameCode
  ) {
    const player1 = new PlayerController('blue', playerName, playerId, true); // host
    this.players = [player1];

    this.timeout = config.gameInstanceTimeout;
    this.handleTimeout = handleTimeout;

    this.currentPlayerTurnId = null; // the current player who's turn it is
    this.playerTurnTimer = null; // how much time the player has left
    this.playerTurnInterval = null; // the setInterval that should be cleared (reset) when it's another players turn

    let timeoutInterval = setInterval(() => {
      let newTimeout = this.handleTimeout(this, () =>
        removeGameInstance(gameCode)
      );

      // if game instance has expired, remove the interval checker
      if (newTimeout === null) {
        clearInterval(timeoutInterval);
      }
    }, config.checkTimeoutInterval);
  }

  addPlayer(player = null, playerName, playerId) {
    // player object has been passed in
    if (player instanceof PlayerController) {
      this.players.push(player);
    } else {
      // add player to team with least amount of players
      let redCount = 0;
      let blueCount = 0;
      this.players.forEach(player => {
        if (player.team === 'red') redCount++;
        if (player.team === 'blue') blueCount++;
      });

      player = new PlayerController(
        blueCount <= redCount ? 'blue' : 'red',
        playerName,
        playerId,
        false // player is not host
      );
      this.players.push(player);
    }

    return player;
  }

  removePlayer(playerId) {
    if (!playerId) {
      return null;
    } else {
      this.players = this.players.filter(player => player.id !== playerId);
    }

    return this.players;
  }

  resetTimeout(newTimeout = config.gameInstanceTimeout) {
    this.timeout = newTimeout;
  }
}

module.exports = GameController;
