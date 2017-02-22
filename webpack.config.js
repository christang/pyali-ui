const path = require('path');
const webpack = require('webpack');

module.exports = {
  context: path.join(__dirname, '/app'),
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  entry: [
    'webpack/hot/only-dev-server',   // <-- Tries HMR but DOESN'T reload browser upon errors
    // 'webpack/hot/dev-server',   // <-- (Default) Tries HMR AND reloads the browser upon errors
    './index.jsx',
  ],
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'bundle.js',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),   // <-- HMR-plugin
    new webpack.DefinePlugin({
      'process.env': { limit: 10000 },
    }),
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
      loader: 'style-loader!css-loader',
    }, {
      test: /\.jpg$/,
      loader: 'file-loader',
    }, {
      test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'file-loader',
    }, {
      test: /\.png$/,
      loader: `url-loader?limit=${process.env.limit}`,
    }, {
      test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
      loader: `url-loader?limit=${process.env.limit}&mimetype=application/font-woff`,
    }, {
      test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
      loader: `url-loader?limit=${process.env.limit}&mimetype=application/octet-stream`,
    }, {
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      loader: `url-loader?limit=${process.env.limit}&mimetype=image/svg+xml`,
    }],
  },
  devServer: {
    proxy: {
      '/merge': {
        target: 'http://entangible.com:8002',
        secure: false,
      },
    },
  },
};
