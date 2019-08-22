const config = require('../../app.json');
const PlayerController = require('./PlayerController');

class GameController {
  constructor(playerName, handleTimeout, removeGameInstance, gameCode) {
    const player1 = new PlayerController('blue', playerName); // host
    this.players = [player1];
    this.timeout = config.gameInstanceTimeout;
    this.handleTimeout = handleTimeout;

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

  addPlayer(player = null, playerName) {
    // player object has been passed in
    if (player instanceof PlayerController) {
      this.players.push(player);
    } else {
      player = new PlayerController('red', playerName);
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
