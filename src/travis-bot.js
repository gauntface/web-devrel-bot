const logHelper = require('./utils/log-helper');
const TravisEnvModel = require('./models/travis-env-model');
const GithubController = require('./controllers/github-controller');

class TravisBot {
  constructor() {
    logHelper.setPrimaryPrefix('TravisBot 🤖');
  }

  run() {
    const travisEnv = new TravisEnvModel();

    if (!travisEnv.isTravis || !travisEnv.isPullRequest) {
      this._logDebugInfo();
      return Promise.resolve();
    }

    return this._logGithubState(travisEnv);
  }

  _logDebugInfo() {
    logHelper.log('🎉 TODO: Debug Results Locally.');
  }

  _logGithubState(travisEnv) {
    const githubController = new GithubController({
      owner: travisEnv.repoDetails.owner,
      repo: travisEnv.repoDetails.repo,
    });

    return githubController.postState({
      sha: travisEnv.pullRequestSha,
      state: 'pending',
    })
    .then(() => {
      return githubController.postComment({
        number: travisEnv.pullRequestNumber,
        sha: travisEnv.pullRequestSha,
        comment: `This is an example comment`,
      });
    })
    .then(() => {
      return githubController.postState({
        sha: travisEnv.pullRequestSha,
        state: 'success',
      });
    })
    .catch((err) => {
      logHelper.error(err);
      return githubController.postState({
        sha: travisEnv.pullRequestSha,
        state: 'error',
      });
    });
  }
}

module.exports = TravisBot;
