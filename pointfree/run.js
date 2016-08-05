const isFunction = require('../internal/isFunction')

function run(m) {
  if(!(m && isFunction(m.run))) {
    throw new TypeError('run: IO required')
  }

  return m.run()
}

module.exports = run
