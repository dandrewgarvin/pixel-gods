const config = require('../../app.json');
const ERROR = require('../ErrorHandling/ERROR');

class PlayerController {
  constructor(team = 'blue', name, playerId, isHost = false) {
    this.id = playerId || this._generatePlayerId();
    this.team = team || 'blue';
    this.position = this.generateInitialPosition();
    this.health = config.playerStartingHealth;
    this.name = name;
    this.isHost = isHost;
  }

  _generatePlayerId() {
    let alphabet =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
    let playerId = '';

    while (playerId.length <= config.playerIdLength) {
      playerId = playerId + alphabet[~~(Math.random() * alphabet.length - 1)];
    }

    return playerId;
  }

  generateInitialPosition() {
    // let xPos = ~~(Math.random() * 20);
    // let yPos = ~~(Math.random() * 5);
    let xPos = -276.617;
    let yPos = -59.888;

    if (this.team !== 'blue') {
      xPos = 880;
      // yPos = 100 - yPos;
    }

    return {
      xPos: xPos + 0.0,
      yPos: yPos + 0.0
    };
  }

  move(movement, xPos, yPos) {
    if (!['jump', 'left', 'right'].includes(movement)) {
      throw ERROR.INVALID_PLAYER_MOVEMENT;
    }
  }
}

module.exports = PlayerController;
