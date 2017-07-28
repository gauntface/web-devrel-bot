const GitHubApi = require('github');
const logHelper = require('../utils/log-helper');

class GithubController {
  constructor({owner, repo}) {
    const token = process.env['GITHUB_TOKEN'];
    if (!token) {
      logHelper.error(`No 'GITHUB_TOKEN' environment variable defined.`);
      throw new Error(`No 'GITHUB_TOKEN' environment variable defined.`);
    }

    this._github = new GitHubApi();
    this._github.authenticate({
      type: 'oauth',
      token: token,
    });

    this._owner = owner;
    this._repo = repo;
  }

  postComment({number, comment}) {
    return this._github.issues.createComment({
      owner: this._owner,
      repo: this._repo,
      number,
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

module.exports = GithubController;
