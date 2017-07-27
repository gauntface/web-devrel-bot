const logHelper = require('./utils/log-helper');
const TravisEnvModel = require('./models/travis-env-model');

class TravisBot {
  constructor() {
    logHelper.setPrimaryPrefix('TravisBot 🤖');
  }

  run() {
    const travisEnv = new TravisEnvModel();

    if (travisEnv.isTravis && travisEnv.isPullRequest) {
      const githubHelper = new GithubHelper({
        owner: travisEnv.repoDetails.owner,
        repo: travisEnv.repoDetails.repo,
      });

      githubHelper.postComment({
        sha: travisEnv.pullRequestSha,
        comment: `This is an example comment`,
      });
    } else {
      this._logDebugInfo();
    }
  }

  _logDebugInfo() {
    logHelper.log('🎉 TODO: Debug Results Locally.');
  }
}

module.exports = TravisBot;
