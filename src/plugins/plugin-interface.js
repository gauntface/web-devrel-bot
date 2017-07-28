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
}

module.exports = PluginInterface;
