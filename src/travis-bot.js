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

    return this._logGithubState();
  }

  _logDebugInfo() {
    logHelper.log('🎉 TODO: Debug Results Locally.');
  }

  _logGithubState() {
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
    .catch(() => {
      return githubController.postState({
        sha: travisEnv.pullRequestSha,
        state: 'error',
      });
    });
  }
}

module.exports = TravisBot;
