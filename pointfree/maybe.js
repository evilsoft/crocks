const isFunction = require('../internal/isFunction')

function maybe(m) {
  if(!(m && isFunction(m.maybe))) {
    throw new TypeError('maybe:Arg must be a Maybe')
  }

  return m.maybe()
}

module.exports = maybe
