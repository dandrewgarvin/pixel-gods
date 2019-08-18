const config = require("../../app.json");
const PlayerController = require("./PlayerController");

class GameController {
  constructor() {
    const player1 = new PlayerController(); // host
    this.players = [player1];
  }

  addPlayer(player = null) {
    // player object has been passed in
    if (player instanceof PlayerController) {
      this.players.push(player);
    } else {
      player = new PlayerController("red");
      this.players.push(player);
    }

    return player;
  }
}

module.exports = GameController;
