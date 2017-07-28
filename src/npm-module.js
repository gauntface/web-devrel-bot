const PluginInterface = require('./plugins/plugin-interface');
const SizePlugin = require('./plugins/size');

module.exports = {
  PluginInterface,
  plugins: {
    Size: SizePlugin,
  }
};
