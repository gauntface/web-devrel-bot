const glob = require('glob');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

const PluginInterface = require('./plugin-interface');
const POSITIVE_EMOJI = '✅';
const NEGATIVE_EMOJI = '🚫';

class SizePlugin extends PluginInterface {
  constructor({globPattern, globOptions} = {}) {
    super('Travis-Bot Size Plugin');

    this._globPattern = globPattern;
    this._globOptions = globOptions;
  }

  run({changedFiles} = {}) {
    if (!this._globPattern) {
      throw new Error(`The '${this.name}' requires a ` +
        `'globPattern' parameter in the constructor.`);
    }

    return new Promise((resolve, reject) => {
      const globOptions = this._globOptions || {};
      globOptions.absolute = true;

      glob(this._globPattern, globOptions, (err, matches) => {
        if (err) {
          return reject(err);
        }
        resolve(matches);
      });
    })
    .then((files) => {
      return files.reduce((promiseChain, filePath) => {
        return promiseChain.then((fileInfoArray) => {
          return fs.stat(filePath)
          .then((stats) => {
            const relativePath = path.relative(process.cwd(), filePath);
            let changedFromMainBranch = false;
            if (changedFiles) {
              changedFromMainBranch = changedFiles.includes(relativePath);
            }
            fileInfoArray.push({
              fullPath: filePath,
              relativePath: relativePath,
              sizeInBytes: stats.size,
              changedFromMainBranch,
            });
            return fileInfoArray;
          });
        });
      }, Promise.resolve([]));
    })
    .then((allFileInfo) => {
      return {
        passed: true,
        prettyLog: this.getPrettyLogResults(allFileInfo),
        markdownLog: this.getMarkdownResults(allFileInfo),
        details: {
          files: allFileInfo,
        }
      };
    });
  }

  static _convertSize(sizeInBytes) {
    let fileSize = sizeInBytes;
    let unit = 'B';
    if (fileSize >= 1000) {
      unit = 'KB';
      fileSize = fileSize / 1000;

      if (fileSize >= 1000) {
        unit = 'MB';
        fileSize = fileSize / 1000;
      }
    }

    return {
      size: fileSize,
      unit,
    };
  }

  getPrettyLogResults(allFileInfo) {
    let log = '';

    let changedFileInfo = allFileInfo.filter((fileInfo) => {
      return fileInfo.changedFromMainBranch;
    });

    let title = `Changed File Sizes\n-------------\n`;
    if (changedFileInfo.length === 0) {
      title = `File Sizes\n-------------\n`;
      changedFileInfo = allFileInfo;
    }

    const fileSizes = {};
    let longestSizeLength = 0;
    let longestPathLength = 0;
    changedFileInfo.forEach((fileInfo) => {
      if (fileInfo.relativePath.length > longestPathLength) {
        longestPathLength = fileInfo.relativePath.length;
      }

      const sizeDetails = SizePlugin._convertSize(fileInfo.sizeInBytes);
      fileSizes[fileInfo.relativePath] = `${sizeDetails.size} ${sizeDetails.unit}`;

      if (fileSizes[fileInfo.relativePath].length > longestSizeLength) {
        longestSizeLength = fileSizes[fileInfo.relativePath].length;
      }
    });

    const changedFilesTable = changedFileInfo.map((fileInfo) => {
      const spaceLength = longestPathLength - fileInfo.relativePath.length;
      let pathString = fileInfo.relativePath;
      for (let i = 0; i < spaceLength; i++) {
        pathString += ' ';
      }
      return `${chalk.yellow(pathString)}  ${chalk.blue(fileSizes[fileInfo.relativePath])}`;
    }).join('\n');

    log += chalk.grey(title);
    log += changedFilesTable;

    return log;
  }

  _generateMDFileSizeTable(arrayOfFileInfo) {
    let tableString = `| | File Path | File Size | Units |\n`;
    tableString += `| --- | --- | --- | --- |\n`;

    tableString += arrayOfFileInfo.map((fileInfo) => {
      const sizeDetails = SizePlugin._convertSize(fileInfo.sizeInBytes);
      const sizeChangeEmoji = '';
      return `| ${sizeChangeEmoji} | ${fileInfo.relativePath} | ${sizeDetails.size} | ${sizeDetails.unit} |`;
    }).join('\n');

    return tableString;
  }

  getMarkdownResults(allFileInfo) {
    const changedFileInfo = allFileInfo.filter((fileInfo) => {
      return fileInfo.changedFromMainBranch;
    });

    let changedSizeTable = 'None of the files caught by the config file have been changed.';
    if (changedFileInfo.length > 0) {
      changedSizeTable = `### Changed File Sizes\n\n`;
      changedSizeTable += this._generateMDFileSizeTable(changedFileInfo);
    }

    let fullSizeTable = this._generateMDFileSizeTable(allFileInfo);

    return `${changedSizeTable}

<details>
<summary>Full List of File Sizes</summary>

${fullSizeTable}

</details>`;
  }
}

module.exports = SizePlugin;
