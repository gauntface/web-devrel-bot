const logHelper = require('../../../src/utils/log-helper');
describe('LogHelper', function() {
  it('should warn', function() {
    logHelper.warn('Warning.');
  });

  it('should print key value pairs', function() {
    logHelper.logKeyValues({
      'Example': 'Example Value',
      'a': 'Short Value',
    });
  });
});
