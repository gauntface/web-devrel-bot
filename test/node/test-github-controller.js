const expect = require('chai').expect;

const GithubController = require('../../src/controllers/github-controller');

describe('github-controller', function() {
  it('should throw without token', function() {
    delete process.env['GITHUB_TOKEN'];

    expect(() => {
      new GithubController({owner: 'example-owner', repo: 'example-repo'});
    }).to.throw(`No 'GITHUB_TOKEN' environment variable defined.`);
  });

  it('should instiate with token', function() {
    process.env['GITHUB_TOKEN'] = 'example-token';

    expect(() => {
      new GithubController({owner: 'example-owner', repo: 'example-repo'});
    }).to.not.throw();
  });
});
