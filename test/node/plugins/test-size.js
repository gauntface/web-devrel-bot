const expect = require('chai').expect;
const sinon = require('sinon');
const path = require('path');
const GitChangedFiles = require('../../../src/utils/git-changed-files');
const SizePlugin = require('../../../src/plugins/size');

describe('plugins.Size', function() {
  it('should get name', function() {
    const plugin = new SizePlugin();
    expect(plugin.name).to.exist;
  });

  it('should run with minimal input', function() {
    const plugin = new SizePlugin({
      globPattern: '**/*',
      globOptions: {
        cwd: path.join(__dirname, '..', '..', 'static', 'size-example'),
      }
    });
    return plugin.run()
    .then((results) => {
      expect(results.passed).to.equal(true);
      expect(results.prettyLog).to.exist;

      // Print all logs when nothings changed.
      const cleanLog = results.prettyLog.replace(
        /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
        '');
      expect(cleanLog).to.equal(`File Sizes
-------------
test/static/size-example/dino.jpg   268.633 KB
test/static/size-example/file1.txt  29 B
test/static/size-example/file2.txt  0 B
test/static/size-example/file3.txt  0 B`);

      expect(results.markdownLog).to.exist;

      expect(results.markdownLog).to.equal(`None of the files caught by the config file have been changed.

<details>
<summary>Full List of File Sizes</summary>

| | File Path | File Size | Units |
| --- | --- | --- | --- |
|  | test/static/size-example/dino.jpg | 268.633 | KB |
|  | test/static/size-example/file1.txt | 29 | B |
|  | test/static/size-example/file2.txt | 0 | B |
|  | test/static/size-example/file3.txt | 0 | B |

</details>`);

      expect(results.details).to.exist;
      expect(results.details.files).to.exist;
      expect(results.details.files).to.deep.equal([
        {
          changedFromMainBranch: false,
          fullPath: path.join(process.cwd(), 'test/static/size-example/dino.jpg'),
          relativePath: 'test/static/size-example/dino.jpg',
          sizeInBytes: 268633
        },
        {
          changedFromMainBranch: false,
          fullPath: path.join(process.cwd(), 'test/static/size-example/file1.txt'),
          relativePath: 'test/static/size-example/file1.txt',
          sizeInBytes: 29
        },
        {
          changedFromMainBranch: false,
          fullPath: path.join(process.cwd(), 'test/static/size-example/file2.txt'),
          relativePath: 'test/static/size-example/file2.txt',
          sizeInBytes: 0
        },
        {
          changedFromMainBranch: false,
          fullPath: path.join(process.cwd(), 'test/static/size-example/file3.txt'),
          relativePath: 'test/static/size-example/file3.txt',
          sizeInBytes: 0
        },
      ]);
    });
  });

  it('should mark changed files', function() {
    const plugin = new SizePlugin({
      globPattern: '**/*',
      globOptions: {
        cwd: path.join(__dirname, '..', '..', 'static', 'size-example'),
      }
    });
    return plugin.run({changedFiles: [
      'test/static/size-example/dino.jpg',
      'test/static/size-example/file2.txt',
    ]})
    .then((results) => {
      expect(results.passed).to.equal(true);
      expect(results.prettyLog).to.exist;

      // Only print changed files
      const cleanLog = results.prettyLog.replace(
        /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
        '');
      expect(cleanLog).to.equal(`Changed File Sizes
-------------
test/static/size-example/dino.jpg   268.633 KB
test/static/size-example/file2.txt  0 B`);

      expect(results.markdownLog).to.exist;
      expect(results.markdownLog).to.equal(`### Changed File Sizes

| | File Path | File Size | Units |
| --- | --- | --- | --- |
|  | test/static/size-example/dino.jpg | 268.633 | KB |
|  | test/static/size-example/file2.txt | 0 | B |

<details>
<summary>Full List of File Sizes</summary>

| | File Path | File Size | Units |
| --- | --- | --- | --- |
|  | test/static/size-example/dino.jpg | 268.633 | KB |
|  | test/static/size-example/file1.txt | 29 | B |
|  | test/static/size-example/file2.txt | 0 | B |
|  | test/static/size-example/file3.txt | 0 | B |

</details>`);

      expect(results.details).to.exist;
      expect(results.details.files).to.exist;
      expect(results.details.files).to.deep.equal([
        {
          changedFromMainBranch: true,
          fullPath: path.join(process.cwd(), 'test/static/size-example/dino.jpg'),
          relativePath: 'test/static/size-example/dino.jpg',
          sizeInBytes: 268633
        },
        {
          changedFromMainBranch: false,
          fullPath: path.join(process.cwd(), 'test/static/size-example/file1.txt'),
          relativePath: 'test/static/size-example/file1.txt',
          sizeInBytes: 29
        },
        {
          changedFromMainBranch: true,
          fullPath: path.join(process.cwd(), 'test/static/size-example/file2.txt'),
          relativePath: 'test/static/size-example/file2.txt',
          sizeInBytes: 0
        },
        {
          changedFromMainBranch: false,
          fullPath: path.join(process.cwd(), 'test/static/size-example/file3.txt'),
          relativePath: 'test/static/size-example/file3.txt',
          sizeInBytes: 0
        },
      ]);
    });
  })

  it('should return 1KB', function() {
    const result = SizePlugin._convertSize(1000);
    expect(result).to.deep.equal({
      size: 1,
      unit: 'KB',
    });
  });

  it('should return 1.5KB', function() {
    const result = SizePlugin._convertSize(1500);
    expect(result).to.deep.equal({
      size: 1.5,
      unit: 'KB',
    });
  });

  it('should return 1MB', function() {
    const result = SizePlugin._convertSize(1000000);
    expect(result).to.deep.equal({
      size: 1,
      unit: 'MB',
    });
  });

  it('should return 1.5MB', function() {
    const result = SizePlugin._convertSize(1500000);
    expect(result).to.deep.equal({
      size: 1.5,
      unit: 'MB',
    });
  });
});
