const isFunction = require('../internal/isFunction')

function maybe(m) {
  if(!(m && isFunction(m.maybe))) {
    throw new TypeError('maybe: Maybe required')
  }

  return m.maybe()
}

module.exports = maybe
