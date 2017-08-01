class PluginInterface {
  constructor(pluginName) {
    if (!pluginName) {
      throw new Error('You must define a plugin name.');
    }
    this._pluginName = pluginName;
  }

  get name() {
    return this._pluginName;
  }

  createLogTable(rows) {
    if (!rows || rows.length === 0) {
      return '';
    }

    let numberOfCols = rows[0].length;
    let columnWidths = [];
    for (let i = 0; i < numberOfCols; i++) {
      columnWidths.push(0);
    }

    rows.forEach((row) => {
      for (let i = 0; i < numberOfCols; i++) {
        let rowEntry = row[i];
        if (rowEntry.length > columnWidths[i]) {
          columnWidths[i] = rowEntry.length;
        }
      }
    });

    const rowStrings = rows.map((row) => {
      const rowStrings = [];
      for (let i = 0; i < numberOfCols; i++) {
        let rowEntry = row[i];
        rowStrings.push(
          this._padWithSpaces(rowEntry, columnWidths[i])
        );
      }
      return rowStrings.join('  ').trim();
    });

    return rowStrings.join('\n');
  }

  createMDTable(headings, rows) {
    if (!rows || rows.length === 0) {
      return '';
    }

    let numberOfCols = headings.length;
    let columnWidths = [];
    for (let i = 0; i < numberOfCols; i++) {
      columnWidths.push(0);
    }

    let headingString = `| ${headings.join(' | ')} |`;
    let headingEnd = `|${' --- |'.repeat(numberOfCols)}`;

    rows.forEach((row) => {
      for (let i = 0; i < numberOfCols; i++) {
        let rowEntry = row[i];
        if (rowEntry.length > columnWidths[i]) {
          columnWidths[i] = rowEntry.length;
        }
      }
    });

    const joinedRows = rows.map((row) => {
      const rowStrings = [];
      for (let i = 0; i < numberOfCols; i++) {
        let rowEntry = row[i];
        rowStrings.push(
          this._padWithSpaces(rowEntry, columnWidths[i])
        );
      }
      return `| ${rowStrings.join(' | ').trim()} |`;
    }).join('\n');
    return [headingString, headingEnd, joinedRows].join('\n');
  }

  _padWithSpaces(string, requiredWidth) {
    return string + ' '.repeat(requiredWidth - string.length);
  }
}

module.exports = PluginInterface;
