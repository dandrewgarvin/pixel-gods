const config = require('../../app.json');
const GAME_STATES = require('../utils/gameStates');
const ERROR = require('../ErrorHandling/ERROR');
const GameController = require('./GameController');
const randomizeStartingOrder = require('../utils/randomizeStartingOrder');

class GameInstanceController {
  constructor() {
    this.instances = [];

    this.removeGameInstance = this.removeGameInstance.bind(this);
  }

  createGameInstance(playerName, playerId) {
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
      playerId,
      this.checkGameInstanceTimeout,
      this.removeGameInstance,
      gameCode
    );

    const newInstance = {
      gameCode,
      gameInstance,
      gameState: GAME_STATES.WAITING
    };

    // add code to instances and return to caller
    this.instances.push(newInstance);

    return newInstance;
  }

  startGameInstance(currentInstance) {
    if (!currentInstance) {
      throw ERROR.GAME_NOT_FOUND;
    }

    let players = currentInstance.gameInstance.players;

    if (players.length > 1) {
      const newPlayers = randomizeStartingOrder(players);

      currentInstance.gameInstance.players = newPlayers;
      currentInstance.gameInstance.currentPlayerTurnId = newPlayers[0].id;

      return currentInstance;
    } else {
      return null;
    }
  }

  _generateGameCode() {
    let alphabet = '1234567890';
    let code = '';

    while (code.length < config.codeLength) {
      code = code + alphabet[~~(Math.random() * alphabet.length - 1)];
    }

    return code;
  }

  findGameInstance(gameCode) {
    let instance;

    // while in development, this will only grab the first instance
    if (gameCode === 'DEV') {
      instance = this.instances[0];
    } else {
      instance = this.instances.find(
        instance => instance.gameCode === gameCode
      );
    }

    return instance;
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
