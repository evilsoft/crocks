var path = require('path')

module.exports = {
  entry: './build/index.js',
  output: {
    filename: 'crocks.js',
    path: path.resolve(__dirname, 'build', 'dist'),
    library: 'crocks',
    libraryTarget: 'umd'
  }
}
