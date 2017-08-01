const expect = require('chai').expect;
const sinon = require('sinon');
const GithubController = require('../../src/controllers/github-controller');

describe('github-controller', function() {
  let stubs = [];

  afterEach(function() {
    stubs.forEach((stub) => {
      stub.restore();
    });
    stubs = [];
  });

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

  it('should throw without input to postIssueComment', function() {
    const controller = new GithubController({owner: 'example-owner', repo: 'example-repo'});
    expect(() => {
      controller.postIssueComment();
    }).to.throw();
  });

  it('should throw on github API error postIssueComment', function() {
    const injectedError = new Error('Injected error.');
    const controller = new GithubController({owner: 'example-owner', repo: 'example-repo'});

    const stub = sinon.stub(controller._github.issues, 'createComment').callsFake(() => {
      return Promise.reject(injectedError);
    });
    stubs.push(stub);

    return controller.postIssueComment({
      number: -1,
      comment: `Example comment text`
    })
    .then(() => {
      throw new Error(`Expected injected error to be thrown.`);
    }, (err) => {
      expect(err).to.equal(injectedError);
    });
  });

  it('should resolve on valid github API postIssueComment', function() {
    const controller = new GithubController({owner: 'example-owner', repo: 'example-repo'});

    const stub = sinon.stub(controller._github.issues, 'createComment').callsFake(() => {
      return Promise.resolve();
    });
    stubs.push(stub);

    return controller.postIssueComment({
      number: -1,
      comment: `Example comment text`
    });
  });

  it('should throw without input to postState', function() {
    const controller = new GithubController({owner: 'example-owner', repo: 'example-repo'});
    expect(() => {
      controller.postState();
    }).to.throw();
  });

  it('should throw on github API error postState', function() {
    const injectedError = new Error('Injected error.');
    const controller = new GithubController({owner: 'example-owner', repo: 'example-repo'});

    const stub = sinon.stub(controller._github.repos, 'createStatus').callsFake(() => {
      return Promise.reject(injectedError);
    });
    stubs.push(stub);

    return controller.postState({
      sha: '-1',
      state: `error`
    })
    .then(() => {
      throw new Error(`Expected injected error to be thrown.`);
    }, (err) => {
      expect(err).to.equal(injectedError);
    });
  });

  it('should resolve on valid github API postState', function() {
    const controller = new GithubController({owner: 'example-owner', repo: 'example-repo'});

    const stub = sinon.stub(controller._github.repos, 'createStatus').callsFake(() => {
      return Promise.resolve();
    });
    stubs.push(stub);

    return controller.postState({
      sha: '1234',
      state: `success`
    });
  });

  it('should reject PR details from github', function() {
    const injectedError = new Error('Injected Error.');
    const controller = new GithubController({owner: 'example-owner', repo: 'example-repo'});

    const stub = sinon.stub(controller._github.pullRequests, 'get').callsFake(() => {
      return Promise.reject(injectedError);
    });
    stubs.push(stub);

    return controller.getPRDetails({
      number: '-1',
    })
    .then(() => {
      throw new Error('Expected injected error to be thrown.');
    }, (err) => {
      expect(err).to.equal(injectedError);
    });
  });

  it('should resolve with PR details', function() {
    const controller = new GithubController({owner: 'example-owner', repo: 'example-repo'});

    const stub = sinon.stub(controller._github.pullRequests, 'get').callsFake(() => {
      return Promise.resolve();
    });
    stubs.push(stub);

    return controller.getPRDetails({
      number: '1234',
    });
  });

  it('should reject repo details from github', function() {
    const injectedError = new Error('Injected Error.');
    const controller = new GithubController({owner: 'example-owner', repo: 'example-repo'});

    const stub = sinon.stub(controller._github.repos, 'get').callsFake(() => {
      return Promise.reject(injectedError);
    });
    stubs.push(stub);

    return controller.getRepoDetails()
    .then(() => {
      throw new Error('Expected injected error to be thrown.');
    }, (err) => {
      expect(err).to.equal(injectedError);
    });
  });

  it('should resolve with repo details', function() {
    const controller = new GithubController({owner: 'example-owner', repo: 'example-repo'});

    const stub = sinon.stub(controller._github.repos, 'get').callsFake(() => {
      return Promise.resolve();
    });
    stubs.push(stub);

    return controller.getRepoDetails();
  });

  it('should reject branch details from github', function() {
    const injectedError = new Error('Injected Error.');
    const controller = new GithubController({owner: 'example-owner', repo: 'example-repo'});

    const stub = sinon.stub(controller._github.repos, 'getBranch').callsFake(() => {
      return Promise.reject(injectedError);
    });
    stubs.push(stub);

    return controller.getBranchDetails({
      branch: 'branchName',
    })
    .then(() => {
      throw new Error('Expected injected error to be thrown.');
    }, (err) => {
      expect(err).to.equal(injectedError);
    });
  });

  it('should resolve with branch details', function() {
    const controller = new GithubController({owner: 'example-owner', repo: 'example-repo'});

    const stub = sinon.stub(controller._github.repos, 'getBranch').callsFake(() => {
      return Promise.resolve();
    });
    stubs.push(stub);

    return controller.getBranchDetails({
      branch: 'branchName',
    });
  });

  it('should remove previous bot comments', function() {
    const EXAMPLE_BOT_NAME = `example-bot-name`;
    const controller = new GithubController({owner: 'example-owner', repo: 'example-repo'});

    const getStub = sinon.stub(controller._github.issues, 'getComments').callsFake(() => {
      return Promise.resolve({
        data: [
          {
            id: '1',
            user: {
              login: EXAMPLE_BOT_NAME
            }
          },
          {
            id: '2',
            user: {
              login: 'someone-else'
            }
          },
          {
            id: '3',
            user: {
              login: EXAMPLE_BOT_NAME
            }
          }
        ]
      });
    });
    stubs.push(getStub);

    const deleteStub = sinon.stub(controller._github.issues, 'deleteComment').callsFake((input) => {
      if (input.id !== '1' && input.id !== '3') {
        return Promise.reject(`Unexpected ID deleted: ${input.id}`);
      }
      return Promise.resolve();
    });
    stubs.push(deleteStub);

    return controller.deletePreviousIssueComments({
      number: '1',
      botName: EXAMPLE_BOT_NAME
    });
  });
});
