const travisbot = require('../../src/npm-module.js');

module.exports = {
  buildCommand: 'echo "Im such a bad build command."',
  repoDetails: {
    owner: 'gauntface',
    repo: 'travis-bot',
  },
  plugins: [
    {
      name: 'Bad Plugin will Error.',
      run: () => {
        return Promise.reject(new Error('Inject Error'));
      },
    }
  ]
};
