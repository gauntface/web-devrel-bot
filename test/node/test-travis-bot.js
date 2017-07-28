const sinon = require('sinon');
const expect = require('chai').expect;

const TravisBot = require('../../src/travis-bot');

describe('travis-bot', function() {
  let stubs = [];
  afterEach(function() {
    stubs.forEach((stub) => {
      stub.restore();
    });
    stubs = [];
  });

  it('should instantiate Travis Bot', function() {
    new TravisBot();
  });

  it('should only print debug info for no travis info', function() {
    const bot = new TravisBot();

    const logSpy = sinon.spy(bot, '_logDebugInfo');

    return bot.run()
    .then(() => {
      expect(logSpy.calledOnce).to.equal(true);
    });
  });

  it('should log to github with travis info', function() {
    process.env['TRAVIS'] = true;
    process.env['TRAVIS_EVENT_TYPE'] = 'pull_request';

    const bot = new TravisBot();

    const stub = sinon.stub(bot, '_logGithubState')
      .callsFake(() => Promise.resolve());
    stubs.push(stub);

    return bot.run()
    .then(() => {
      expect(stub.calledOnce).to.equal(true);
    });
  });
});
