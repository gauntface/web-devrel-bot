const sinon = require('sinon');
const path = require('path');
const proxyquire = require('proxyquire');
const expect = require('chai').expect;

class FakeGithubController {
  getRepoDetails() {
    return Promise.resolve({
      data: {
        clone_url: 'http://fake-url.from/fake-github-controller'
      }
    });
  }
  postComment(options) {
    console.log(options);
  }
}

const TravisBot = proxyquire('../../src/controllers/travis-bot-runner.js', {
  './github-controller': FakeGithubController,
  'child_process': {
    execSync: (command) => {
      console.log(`Running fake execSync command: '${command}'`);
    }
  }
});

describe('travis-bot', function() {
  let stubs = [];

  afterEach(function() {
    stubs.forEach((stub) => {
      stub.restore();
    });
    stubs = [];

    delete process.env['TRAVIS'];
    delete process.env['TRAVIS_EVENT_TYPE'];
    delete process.env['TRAVIS_PULL_REQUEST'];
    delete process.env['TRAVIS_REPO_SLUG'];
  });

  it('should instantiate Travis Bot', function() {
    new TravisBot();
  });

  it('should error when no repo-details in config or travis', function() {
    const bot = new TravisBot({
      configPath: path.join(__dirname, '../static/no-repo-details.config.js')
    });

    return bot.run()
    .then(() => {
      throw new Error('Expected error to be thrown due to no repo details');
    }, (err) => {
      expect(err.message.indexOf(`Unable to get the Github 'repoDetails'`))
        .to.not.equal(-1);
    });
  });

  it ('should get repo details from travis', function() {
    process.env['TRAVIS_REPO_SLUG'] = 'gauntface/example-repo';

    const bot = new TravisBot({
      configPath: path.join(__dirname, '../static/no-repo-details.config.js')
    });

    return bot.run();
  })

  it('should instantiate Travis Bot and print to log', function() {
    const bot = new TravisBot({
      configPath: path.join(__dirname, '../static/example.config.js')
    });

    const logSpy = sinon.spy(bot, '_logDebugInfo');

    return bot.run()
    .then(() => {
      expect(logSpy.calledOnce).to.equal(true);
    });
  });

  it('should handle no name plugins', function() {
    const bot = new TravisBot({
      configPath: path.join(__dirname, '../static/no-plugin-name.config.js')
    });

    return bot.run()
    .then(() => {
      throw new Error('Expect bad plugin to throw error.');
    }, (err) => {
      expect(err.message).to.equal('One of the plugins has failed to define a name property. This is required for reporting.');
    });
  });

  it('should handle bad plugins', function() {
    const bot = new TravisBot({
      configPath: path.join(__dirname, '../static/bad-plugin.config.js')
    });

    return bot.run()
    .then(() => {
      throw new Error('Expect bad plugin to throw error.');
    }, (err) => {
      expect(err.message).to.equal(`The 'Bad Plugin will Error.' threw an error while running: 'Inject Error'`);
    });
  });

  it('should handle good custom plugin', function() {
    const bot = new TravisBot({
      configPath: path.join(__dirname, '../static/example-with-plugin.config.js')
    });

    return bot.run();
  });

  it('should try to print to Github', function() {
    process.env['TRAVIS'] = 'true';
    process.env['TRAVIS_EVENT_TYPE'] = 'pull_request';
    process.env['TRAVIS_PULL_REQUEST'] = '123';

    const stub = sinon.stub(FakeGithubController.prototype, 'postComment').callsFake((input) => {
      expect(input).to.deep.equal({
        number: '123',
        comment: '# Results from Plugins\n\n## Good Plugin.\n\nThis plugin provided no markdown output.\n\n## Good Plugin 2.\n\n`Hello  from good plugin.`\n\n'
      });
    });
    stubs.push(stub);

    const bot = new TravisBot({
      configPath: path.join(__dirname, '../static/example-with-plugin.config.js')
    });

    return bot.run();
  });

  it('should pull from repo when its a Travis PR', function() {
    process.env['TRAVIS_PULL_REQUEST_SHA'] = '123';

    const bot = new TravisBot({
      configPath: path.join(__dirname, '../static/example-with-plugin.config.js')
    });

    return bot.run();
  });

  it('should handle non-existant config file', function() {
    const bot = new TravisBot({
      configPath: path.join(__dirname, '../static/doesnt-exist.config.js')
    });

    return bot.run()
    .then(() => {
      throw new Error('Expected error to be thrown.');
    }, (err) => {
      expect(err.message.indexOf('Unable to find the config file')).to.equal(0);
    });
  });

  it('should handle throwing config file', function() {
    const bot = new TravisBot({
      configPath: path.join(__dirname, '../static/throwing.config.js')
    });

    return bot.run()
    .then(() => {
      throw new Error('Expected error to be thrown.');
    }, (err) => {
      expect(err.message.indexOf('A problem occurred running the config file.')).to.equal(0);
    });
  });

  it('should handle non-returning config file', function() {
    const bot = new TravisBot({
      configPath: path.join(__dirname, '../static/non-returning.config.js')
    });

    return bot.run()
    .then(() => {
      throw new Error('Expected error to be thrown.');
    }, (err) => {
      expect(err.message).to.equal(`Unable to get the Github 'repoDetails' from Travis environment variable or the configuration file.`);
    });
  });
});
