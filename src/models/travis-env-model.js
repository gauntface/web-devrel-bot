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

  get pullRequestSha() {
    return process.env['TRAVIS_PULL_REQUEST_SHA'];
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
