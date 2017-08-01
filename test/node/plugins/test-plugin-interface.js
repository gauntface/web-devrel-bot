const expect = require('chai').expect;
const PluginInterface = require('../../../src/plugins/plugin-interface');

describe('Plugin Interface', function() {
  it('should throw when no name defined', function() {
    expect(() => {
      new PluginInterface();
    }).to.throw('You must define a plugin name.');
  })
});
