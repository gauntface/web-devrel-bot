const expect = require('chai').expect;
const TravisEnvModel = require('../../src/models/travis-env-model');

describe('travis-env-model', function() {
  it('is not travis', function() {
    delete process.env['TRAVIS'];

    const travisEnv = new TravisEnvModel();
    expect(travisEnv.isTravis).to.equal(false);
  });

  it('is travis', function() {
    process.env['TRAVIS'] = 'true';

    const travisEnv = new TravisEnvModel();
    expect(travisEnv.isTravis).to.equal(true);
  });

  it('is not pull request', function() {
    delete process.env['TRAVIS_EVENT_TYPE'];

    const travisEnv = new TravisEnvModel();
    expect(travisEnv.isPullRequest).to.equal(false);
  });

  it('is not pull request either', function() {
    process.env['TRAVIS_EVENT_TYPE'] = 'push';

    const travisEnv = new TravisEnvModel();
    expect(travisEnv.isPullRequest).to.equal(false);
  });

  it('is pull request', function() {
    process.env['TRAVIS_EVENT_TYPE'] = 'pull_request';

    const travisEnv = new TravisEnvModel();
    expect(travisEnv.isPullRequest).to.equal(true);
  });

  it('no repo details', function() {
    delete process.env['TRAVIS_REPO_SLUG'];

    const travisEnv = new TravisEnvModel();
    expect(travisEnv.repoDetails).to.equal(null);
  });

  it('no repo details either', function() {
    process.env['TRAVIS_REPO_SLUG'] = 'example';

    const travisEnv = new TravisEnvModel();
    expect(travisEnv.repoDetails).to.equal(null);
  });

  it('no repo details as well', function() {
    process.env['TRAVIS_REPO_SLUG'] = 'example/example-two/nope';

    const travisEnv = new TravisEnvModel();
    expect(travisEnv.repoDetails).to.equal(null);
  });

  it('get repo details', function() {
    process.env['TRAVIS_REPO_SLUG'] = 'example-owner/example-repo';

    const travisEnv = new TravisEnvModel();
    expect(travisEnv.repoDetails).to.deep.equal({
      owner: 'example-owner',
      repo: 'example-repo',
    });
  });

  it('no PR sha', function() {
    delete process.env['TRAVIS_PULL_REQUEST_SHA'];

    const travisEnv = new TravisEnvModel();
    expect(travisEnv.pullRequestSha).to.equal(undefined);
  });

  it('get PR sha', function() {
    const injectedSha = '123456789abcde';
    process.env['TRAVIS_PULL_REQUEST_SHA'] = injectedSha;

    const travisEnv = new TravisEnvModel();
    expect(travisEnv.pullRequestSha).to.equal(injectedSha);
  });

  it('no test results', function() {
    delete process.env['TRAVIS_TEST_RESULT'];

    const travisEnv = new TravisEnvModel();
    expect(travisEnv.isSuccessfulTravisRun).to.equal(undefined);
  });

  it('bad test results', function() {
    process.env['TRAVIS_TEST_RESULT'] = '1';

    const travisEnv = new TravisEnvModel();
    expect(travisEnv.isSuccessfulTravisRun).to.equal(false);
  });

  it('good test results', function() {
    process.env['TRAVIS_TEST_RESULT'] = '0';

    const travisEnv = new TravisEnvModel();
    expect(travisEnv.isSuccessfulTravisRun).to.equal(true);
  });
});
