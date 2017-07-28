const chalk = require('chalk');

class LogHelper {
  constructor() {
    this._prefix;
  }

  setPrimaryPrefix(newPrefix) {
    this._prefix = newPrefix;
  }

  _getPrefix(color) {
    if (!this._prefix) {
      return '';
    }

    return color(`[${this._prefix}]:`);
  }

  log() {
    console.log(this._getPrefix(chalk.green), ...arguments);
  }

  warn() {
    console.log(this._getPrefix(chalk.yellow), ...arguments);
  }

  error() {
    console.log(this._getPrefix(chalk.red), ...arguments);
  }

  logKeyValues(keyValues) {
    let longestString = 0;
    const keys = Object.keys(keyValues);
    keys.forEach((keyName) => {
      if (keyName.length > longestString) {
        longestString = keyName.length;
      }
    });

    keys.forEach((keyName) => {
      let spaceString = '  ';
      const spaceLength = longestString - keyName.length;
      for(let i = 0; i < spaceLength; i++) {
        spaceString += ' ';
      }

      this.log(
        '  ' +
        chalk.gray(keyName) +
        spaceString +
        chalk.blue(`'${keyValues[keyName]}'`)
      );
    });
  }
}

module.exports = new LogHelper();
