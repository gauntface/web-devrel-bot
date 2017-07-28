const GitHubApi = require('github');
const logHelper = require('../utils/log-helper');

class GithubHelper {
  constructor({owner, repo}) {
    this._github = new GitHubApi();

    const token = process.env['GITHUB_TOKEN'];
    if (!token) {
      logHelper.error(`No 'GITHUB_TOKEN' environment variable defined.`);
      throw new Error(`No 'GITHUB_TOKEN' environment variable defined.`);
    }

    this._github.authenticate({
      type: 'oauth',
      token: token,
    });

    this._owner = owner;
    this._repo = repo;
  }

  postComment({sha, comment}) {
    return this._github.repos.createCommitComment({
      owner: this._owner,
      repo: this._repo,
      sha: sha,
      body: comment
    });
  }

  postState({sha, state}) {
    return this._github.repos.createStatus({
      owner: this._owner,
      repo: this._repo,
      sha: sha,
      state,
      context: 'Travis Bot',
      description: 'Travis Bot is a basic helper to report and enforce rules ' +
        'on a Github Pull Request.'
    });
  }
}

module.exports = GithubHelper;
