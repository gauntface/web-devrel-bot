class BotResults {
  constructor() {

  }

  get isSuccessfulBuild() {
    return (process.env['TRAVIS_TEST_RESULT'] === 0);
  }

  get repoSlug() {
    if (!process.env['TRAVIS_REPO_SLUG']) {
      return null;
    }

    return process.env['TRAVIS_REPO_SLUG'].toLowerCase();
  }
}

module.exports = BotResults;
