const LogHelper = require('./log-helper');
const BotResults = require('./bot-results');

class TravisBot {
  constructor() {
    this._logHelper = new LogHelper('TravisBot 🤖');
  }

  run() {
    /** this._logHelper.log(`Environment variables`);
    const environmentVariables = [
      'TRAVIS',
      'TRAVIS_PULL_REQUEST',
      'TRAVIS_PULL_REQUEST_BRANCH',
      'TRAVIS_TEST_RESULT',
    ];
    const keyValues = {};
    environmentVariables.forEach((varName) => {
      keyValues[varName] = process.env[varName];
    });

    this._logHelper.logKeyValues(keyValues);**/

    const botResults = new BotResults();
    this._logInfo(botResults);

    if (process.env['TRAVIS'] === 'true' &&
      process.env['TRAVIS_EVENT_TYPE'].toLowerCase() === 'pull_request') {
      const repoPieces = process.env['TRAVIS_REPO_SLUG'].split('/');
      const githubHelper = new GithubHelper({
        token: process.env['GIT_TOKEN'],
        owner: repoPieces[0],
        repo: repoPieces[1],
      });
      githubHelper.postComment({
        sha: process.env['TRAVIS_PULL_REQUEST_SHA'],
        comment: `This is an example comment`,
      });
    }
  }

  _logInfo(botResults) {
    if (botResults.isSuccessfulBuild) {
      this._logHelper.log('🎉 Travis build was successful.');
    } else {
      this._logHelper.warn('⚠️ Travis build was unsuccessful. ' +
        'Results may not be valid.');
    }
  }
}

module.exports = TravisBot;
