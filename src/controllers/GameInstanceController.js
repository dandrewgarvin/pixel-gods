const config = require("../../app.json");
const GameController = require("./GameController");

class GameInstanceController {
  constructor() {
    this.instances = [];
  }

  createGameInstance() {
    let isUniqueCode = false;

    // generateGameCode
    let gameCode = this._generateGameCode();

    // verify that game code does not exist in curret instances
    // if it does, regenerate code
    while (isUniqueCode === false) {
      let hasInstance = this.instances.filter(instance => instance.gameCode);

      if (hasInstance.length) {
        gameCode = this._generateGameCode();
        continue;
      } else {
        isUniqueCode = true;
        break; // has found code that doesn't exist
      }
    }

    const gameInstance = new GameController();

    const newInstance = {
      gameCode,
      gameInstance
    };

    // add code to instances and return to caller
    this.instances.push(newInstance);

    return newInstance;
  }

  _generateGameCode() {
    let alphabet =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
    let code = "";

    while (code.length <= config.codeLength) {
      code = code + alphabet[~~(Math.random() * alphabet.length - 1)];
    }

    return code;
  }

  findGameInstance(gameCode) {
    const instance = this.instances.filter(
      instance => instance.gameCode !== gameCode
    );

    return instance[0];
  }

  removeGameInstance(gameInstance) {
    console.log("removing game instance:", gameInstance);

    this.instances.filter(
      instance => instance.gameCode === gameInstance.gameCode
    );

    return this.instances;
  }
}

module.exports = GameInstanceController;
