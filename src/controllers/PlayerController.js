const config = require("../../app.json");

class PlayerController {
  constructor(team = "blue") {
    this.id = this._generatePlayerId();
    this.team = team;
    this.position = this.generateInitialPosition();
    this.health = config.playerStartingHealth;
  }

  _generatePlayerId() {
    let alphabet =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
    let playerId = "";

    while (playerId.length <= config.playerIdLength) {
      playerId = playerId + alphabet[~~(Math.random() * alphabet.length - 1)];
    }

    return playerId;
  }

  generateInitialPosition() {
    let xPos = ~~(Math.random() * 20);
    let yPos = ~~(Math.random() * 5);

    if (this.team !== "blue") {
      xPos = 100 - xPos;
      yPos = 100 - yPos;
    }

    return {
      xPos: xPos + 0.0,
      yPos: yPos + 0.0
    };
  }

  move(movement, xPos, yPos) {
    if (!["jump", "left", "right"].includes(movement)) {
      throw "Invalid movement type";
    }
  }
}

module.exports = PlayerController;
