const webpackMerge = require('webpack-merge')

const applyPresets = (env = { presets: [] }) => {
  const { presets } = env
  const mergedPresets = [].concat(...[presets])
  console.log('presets', presets)
  const mergedConfigs = mergedPresets.map(presetName => {
    return require(`./presets/webpack.${presetName}`)(env)
  })
  return webpackMerge({}, ...mergedConfigs)
}

module.exports = applyPresets