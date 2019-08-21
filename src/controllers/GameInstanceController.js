const config = require('../../app.json');
const gameStates = require('../utils/gameStates');
const GameController = require('./GameController');

class GameInstanceController {
  constructor() {
    this.instances = [];

    this.removeGameInstance = this.removeGameInstance.bind(this);
  }

  createGameInstance(playerName) {
    let isUniqueCode = false;

    // generateGameCode
    let gameCode = this._generateGameCode();

    // verify that game code does not exist in curret instances
    // if it does, regenerate code
    while (isUniqueCode === false) {
      let hasInstance = this.instances.find(instance => instance.gameCode);

      if (!hasInstance) {
        gameCode = this._generateGameCode();
        break;
      } else {
        isUniqueCode = true;
        break; // has found code that doesn't exist
      }
    }

    const gameInstance = new GameController(
      playerName,
      this.checkGameInstanceTimeout,
      this.removeGameInstance,
      gameCode
    );

    const newInstance = {
      gameCode,
      gameInstance,
      gameState: gameStates.WAITING
    };

    // add code to instances and return to caller
    this.instances.push(newInstance);

    return newInstance;
  }

  startGameInstance(currentInstance) {
    if (!currentInstance) {
      throw 'Unable to find game instance. Please make sure you send the right code';
    }

    if (currentInstance.gameInstance.players.length > 1) {
      const startingPlayer = ~~(Math.random() * 1);
      currentInstance.gameState = startingPlayer
        ? gameStates.BLUETURN
        : gameStates.REDTURN;
    } else {
      return null;
    }
  }

  _generateGameCode() {
    let alphabet =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
    let code = '';

    while (code.length < config.codeLength) {
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

  removeGameInstance(gameCode) {
    console.log('REMOVING INSTANCE', gameCode);

    this.instances = this.instances.filter(
      instance => instance.gameCode !== gameCode
    );

    return this.instances;
  }

  checkGameInstanceTimeout(instance, removeGameInstance) {
    if (instance.timeout - config.checkTimeoutInterval <= 0) {
      removeGameInstance(instance);
      return null;
    } else {
      instance.timeout -= config.checkTimeoutInterval;
      return instance.timeout;
    }
  }
}

module.exports = GameInstanceController;
