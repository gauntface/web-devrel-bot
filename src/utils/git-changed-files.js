const exec = require('child_process').exec;

module.exports = (travisEnv, cwd) => {
  let gitBranchDiff = `$(git merge-base master HEAD)`;
  if (travisEnv.isTravis) {
    gitBranchDiff = `FETCH_HEAD $(git merge-base FETCH_HEAD ${travisEnv.gitBranch})`;
  }

  const command = `git --no-pager diff --name-only ` +
    `--diff-filter=ACMRTUXB ${gitBranchDiff}`;

  return new Promise((resolve, reject) => {
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
