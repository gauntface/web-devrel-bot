const travisbot = require('../../src/npm-module.js');

module.exports = {
  repoDetails: {
    owner: 'gauntface',
    repo: 'travis-bot',
  },
  plugins: [
    {
      name: 'Good Plugin.',
      run: () => {
        return Promise.resolve({

        });
      },
    },
    {
      name: 'Good Plugin 2.',
      run: () => {
        return Promise.resolve({
          prettyLog: 'Hello from good plugin.',
          markdownLog: '`Hello  from good plugin.`'
        });
      },
    }
  ]
};
