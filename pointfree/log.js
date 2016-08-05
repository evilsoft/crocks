const isFunction = require('../internal/isFunction')

function log(m) {
  if(!(m && isFunction(m.log))) {
    throw new TypeError('log: Writer required')
  }

  return m.log()
}

module.exports = log
