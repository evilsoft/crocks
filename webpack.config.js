const webpack = require('webpack')

module.exports = {
  entry: './crocks.js',
  output: {
    filename:       'dist/crocks.js',
    library:        'crocks',
    libraryTarget:  'umd',
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel" }
    ]
  }
}
