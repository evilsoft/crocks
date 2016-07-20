const isFunction = require('../internal/isFunction')

function run(m) {
  if(!(m && isFunction(m.run))) {
    throw new TypeError('run: Arg must be an IO')
  }

  return m.run()
}

module.exports = run
