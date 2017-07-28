const exec = require('child_process').exec;
const logHelper = require('./log-helper');

module.exports = {
  get: (travisEnv, cwd) => {
    let gitBranchDiff = `$(git merge-base master HEAD)`;

    const command = `git --no-pager diff --name-only ` +
      `--diff-filter=ACMRTUXB ${gitBranchDiff}`;

    return new Promise((resolve, reject) => {
      logHelper.log(`Getting changed files with: '${gitBranchDiff}'`);
      exec(command, {cwd: cwd}, (err, stdOut, stdErr) => {
          if (err) {
            return reject(err);
          }

          resolve(stdOut.trim());
        });
    })
    .then((rawOutput) => {
      return rawOutput.split('\n');
    });
  }
};
