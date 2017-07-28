const logHelper = require('./utils/log-helper');
const TravisEnvModel = require('./models/travis-env-model');

class TravisBot {
  constructor() {
    logHelper.setPrimaryPrefix('TravisBot 🤖');
  }

  run() {
    const travisEnv = new TravisEnvModel();

    if (!travisEnv.isTravis || !travisEnv.isPullRequest) {
      this._logDebugInfo();
    }

    const githubHelper = new GithubHelper({
      owner: travisEnv.repoDetails.owner,
      repo: travisEnv.repoDetails.repo,
    });

    return githubHelper.postState({
      sha: travisEnv.pullRequestSha,
      state: 'pending',
    })
    .then(() => {
      return githubHelper.postComment({
        sha: travisEnv.pullRequestSha,
        comment: `This is an example comment`,
      });
    })
    .then(() => {
      return githubHelper.postState({
        sha: travisEnv.pullRequestSha,
        state: 'success',
      });
    })
    .catch(() => {
      return githubHelper.postState({
        sha: travisEnv.pullRequestSha,
        state: 'error',
      });
    });
  }

  _logDebugInfo() {
    logHelper.log('🎉 TODO: Debug Results Locally.');
  }
}

module.exports = TravisBot;
