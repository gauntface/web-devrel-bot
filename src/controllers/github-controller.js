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
    // Can this be type of 'token' ?
    this._github.authenticate({
      type: 'oauth',
      token: token,
    });

    this._owner = owner;
    this._repo = repo;
  }

  /**
   * Pull requests are treated as issues by the Github API.
   */
  postIssueComment({number, comment}) {
    return this._github.issues.createComment({
      owner: this._owner,
      repo: this._repo,
      number,
      body: comment
    });
  }

  /**
   * This will show up in PR's as the current state (same place as Travis
   * status can block a PR.)
   */
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

  /**
   * Get the details for a specific PR
   */
  getPRDetails({number}) {
    return this._github.pullRequests.get({
      owner: this._owner,
      repo: this._repo,
      number,
    });
  }

  getRepoDetails() {
    return this._github.repos.get({
      owner: this._owner,
      repo: this._repo,
    });
  }

  getBranchDetails({branch}) {
    return this._github.repos.getBranch({
      owner: this._owner,
      repo: this._repo,
      branch,
    });
  }
}

module.exports = GithubController;
