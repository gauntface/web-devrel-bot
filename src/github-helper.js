const GitHubApi = require('github');

class GithubHelper {
  constructor({token, owner, repo}) {
    this._github = new GitHubApi();
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
}

module.exports = GithubHelper;
