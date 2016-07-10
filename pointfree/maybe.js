const isFunction = require('../internal/isFunction')

function maybe(m) {
  if(!isFunction(m.maybe)) {
    throw new TypeError('Argument to maybe must be a Maybe')
  }

  return m.maybe()
}

module.exports = maybe
