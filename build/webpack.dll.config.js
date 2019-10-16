const webpack = require('webpack');
const path = require('path');
const library = '[name]_lib';

module.exports = {
  mode: 'production',
  context: path.join(__dirname, "../dist"),
  entry: {
    vendor: [
      'react',
      'react-dom',
      'react-router-dom',
      'mobx',
      'mobx-react',
      'axios',
      'classnames',
      'rc-dialog',
      'rc-animate',
    ]
  },
  output: {
    filename: 'dll/[name].dll.js',
    library
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, '../dist/dll/[name]-manifest.json'),
      // This must match the output.library option above
      name: library
    })
  ]
}