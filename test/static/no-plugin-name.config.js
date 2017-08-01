const travisbot = require('../../src/npm-module.js');

module.exports = {
  repoDetails: {
    owner: 'gauntface',
    repo: 'travis-bot',
  },
  plugins: [
    {
      run: () => {
        return Promise.resolve();
      },
    }
  ]
};
