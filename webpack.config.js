module.exports = {
  entry: './crocks.js',
  output: {
    filename: 'dist/crocks.js',
    library: 'crocks',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          { loader: 'babel-loader' }
        ]
      }
    ]
  }
}
