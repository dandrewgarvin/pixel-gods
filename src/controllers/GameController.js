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

  addPlayer(player = null) {
    // player object has been passed in
    if (player instanceof PlayerController) {
      this.players.push(player);
    } else {
      player = new PlayerController('red');
      this.players.push(player);
    }

    return player;
  }
}

module.exports = GameController;
