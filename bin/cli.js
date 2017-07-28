#! /usr/bin/env node

const meow = require('meow');
const path = require('path');
const TravisBotRunner = require('../src/controllers/travis-bot-runner');

const cli = meow(`
    Usage
      $ travis-bot

    Options
      -c, --config  Optional path to config file [Defaults to travis-bot.config.js]

    Examples
      $ travis-bot
      $ travis-bot --config ./config/my-travis-bot-config.js
`, {
    alias: {
        c: 'config'
    }
});

const options = {};
if (cli.flags.config) {
  options.configPath = path.resolve(cli.flags.config);
}

const travisBotRuner = new TravisBotRunner();
travisBotRuner.run(options);
