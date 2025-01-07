const webpack = require('webpack');
const mode = process.env.NODE_ENV || 'development';

module.exports = {
  entry: './index.js',
  devtool: 'source-map',
  target: 'web',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules\/(?!(@noble|ethereum-cryptography)\/).*/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              '@babel/plugin-syntax-bigint',
              '@babel/plugin-proposal-optional-chaining',
              '@babel/plugin-transform-numeric-separator',
            ],
          },
        },
      },
    ],
  },
  resolve: {
    modules: ['../../node_modules'],
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.DefinePlugin({
      ENVIRONMENT: JSON.stringify(mode),
    }),
  ],
  mode,
};
