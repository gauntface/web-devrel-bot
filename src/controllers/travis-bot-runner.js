const fs = require('fs-extra');
const path = require('path');
const logHelper = require('../utils/log-helper');
const getChangedFiles = require('../utils/git-changed-files');
const TravisEnvModel = require('../models/travis-env-model');
const GithubController = require('./github-controller');

class TravisBot {
  constructor() {
    logHelper.setPrimaryPrefix('TravisBot 🤖');
  }

  run({configPath} = {}) {
    if (!configPath) {
      configPath = path.resolve('travis-bot.config.js')
    }

    const travisEnv = new TravisEnvModel();

    return fs.access(configPath)
    .catch((err) => {
      console.error(`Unable to find the config file: '${configPath}'.`, err);
      throw new Error(`Unable to find the config file: '${configPath}'.`);
    })
    .then(() => {
      let configuration;
      try {
        configuration = require(configPath);
      } catch (err) {
        console.error(`A problem occurred running the config file.`, err);
        throw new Error(`A problem occurred running the config file.`);
      }

      return getChangedFiles(travisEnv, process.cwd())
      .then((changedFiles) => {
        return this._runPlugins(configuration.plugins, changedFiles)
        .catch((err) => {
          console.error(`Unable to run the config plugins.`, err);
        throw new Error(`Unable to run the config plugins.`);
        });
      });
    })
    .then((pluginResults) => {
      if (!travisEnv.isTravis || !travisEnv.isPullRequest) {
        this._logDebugInfo(pluginResults);
        return Promise.resolve();
      }

      return this._logGithubState(travisEnv, pluginResults);
    });
  }

  _runPlugins(plugins, changedFiles) {
    const pluginResults = {};
    return plugins.reduce((promiseChain, plugin) => {
      logHelper.log(`Running Plugins....`);
      return promiseChain.then(() => {
        logHelper.log(`  '${plugin.name}'`);
        return plugin.run({changedFiles})
        .then((result) => {
          if (!plugin.name) {
            return ;
          }

          pluginResults[plugin.name] = result;
        });
      });
    }, Promise.resolve())
    .then(() => {
      logHelper.log(``);
      return pluginResults;
    });
  }

  _logDebugInfo(pluginResults) {
    const pluginNames = Object.keys(pluginResults);
    pluginNames.forEach((pluginName) => {
      const result = pluginResults[pluginName];
      let statusEmoji = result.passed ? '🎉' : '☠️';

      logHelper.log(`Results from '${pluginName}'.`);
      logHelper.log(`  Status: ${statusEmoji}`);

      console.log('');
      console.log(result.prettyLog);
      console.log('');
    });
  }

  _logGithubState(travisEnv, pluginResults) {
    const githubController = new GithubController({
      owner: travisEnv.repoDetails.owner,
      repo: travisEnv.repoDetails.repo,
    });

    let githubComment = `# Info from travis-bot\n\n`;
    const pluginNames = Object.keys(pluginResults);
    pluginNames.forEach((pluginName) => {
      const result = pluginResults[pluginName];
      let statusEmoji = result.passed ? '🎉' : '☠️';
      githubComment += `## ${statusEmoji} '${pluginName}'\n\n`;
      githubComment += result.markdownLog;
      githubComment += `\n\n`;
    });

    return githubController.postComment({
      number: travisEnv.pullRequestNumber,
      comment: githubComment,
    })
    .catch((err) => {
      logHelper.error(err);
    });
  }
}

module.exports = TravisBot;
