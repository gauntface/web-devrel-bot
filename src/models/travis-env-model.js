class TravisEnvModel {
  get isTravis() {
    return (process.env['TRAVIS'] === 'true');
  }

  get isPullRequest() {
    return (process.env['TRAVIS_EVENT_TYPE'] === 'pull_request');
  }

  get repoDetails() {
    if (!process.env['TRAVIS_REPO_SLUG']) {
      return null;
    }

    const splitSlug = process.env['TRAVIS_REPO_SLUG'].split('/');
    if (splitSlug.length !== 2) {
      return null;
    }

    return {
      owner: splitSlug[0],
      repo: splitSlug[1],
    }
  }

  // The target branch of the pull request OR the current
  // branch that is commited to.
  get gitBranch() {
    return process.env['TRAVIS_BRANCH'];
  }

  get pullRequestSha() {
    return process.env['TRAVIS_PULL_REQUEST_SHA'];
  }

  get pullRequestNumber() {
    if (!process.env['TRAVIS_PULL_REQUEST'] || process.env['TRAVIS_PULL_REQUEST'] === 'false') {
      return undefined;
    }

    return process.env['TRAVIS_PULL_REQUEST'];
  }

  get isSuccessfulTravisRun() {
    const testResult = process.env['TRAVIS_TEST_RESULT'];
    if (typeof testResult === 'undefined') {
      return undefined;
    }

    return (testResult === '0');
  }
}

module.exports = TravisEnvModel;
