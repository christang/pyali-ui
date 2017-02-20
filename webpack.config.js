const path = require('path');
const webpack = require('webpack');

module.exports = {
  context: path.join(__dirname, '/app'),
  entry: [
    'webpack/hot/only-dev-server',   // <-- Tries HMR but DOESN'T reload browser upon errors
    // 'webpack/hot/dev-server',   // <-- (Default) Tries HMR AND reloads the browser upon errors
    './index.js',
  ],
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'bundle.js',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),   // <-- HMR-plugin
  ],
  module: {
    loaders: [{
      test: /.jsx?$/,
      loaders: [
        'react-hot-loader',  // <-- react-hot-loader
        'babel-loader?presets[]=es2015&presets[]=react',  // <-- mv query into loader string
      ],
      exclude: /node_modules/,
    }, {
      test: /\.css$/,
      loader: 'style!css',  // <-- style-loader
    }],
  },
};
