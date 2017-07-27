const chalk = require('chalk');

class LogHelper {
  constructor() {
    this._prefix;
  }

  setPrimaryPrefix(newPrefix) {
    this._prefix = newPrefix;
  }

  log() {
    console.log(chalk.green(`[${this._prefix}]:`), ...arguments);
  }

  warn() {
    console.log(chalk.yellow(`[${this._prefix}]:`), ...arguments);
  }

  error() {
    console.log(chalk.red(`[${this._prefix}]:`), ...arguments);
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
