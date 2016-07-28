const isFunction = require('../internal/isFunction')

function log(m) {
  if(!(m && isFunction(m.log))) {
    throw new TypeError('log: Arg must be a Writer')
  }

  return m.log()
}

module.exports = log
