const isFunction = require('../internal/isFunction')

function value(m) {
  if(!(m && isFunction(m.value))) {
    throw new TypeError('value: Either, Identity, Writer or Monoid required')
  }

  return m.value()
}

module.exports = value
