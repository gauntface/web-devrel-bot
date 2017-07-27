const chalk = require('chalk');

class LogHelper {
  constructor(prefix) {
    this._prefix = prefix;
  }

  log() {
    console.log(chalk.green(`[${this._prefix}]:`), ...arguments);
  }

  warn() {
    console.log(chalk.yellow(`[${this._prefix}]:`), ...arguments);
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

module.exports = LogHelper;
