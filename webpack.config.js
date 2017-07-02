module.exports = {
  entry: './lib/index.js',
  output: {
    filename: 'dist/crocks.js',
    library: 'crocks',
    libraryTarget: 'umd',
  },
  stats: {
    warnings: false
  }
}
