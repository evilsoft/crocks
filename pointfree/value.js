const isFunction = require('../internal/isFunction')

function value(m) {
  if(!(m && isFunction(m.value))) {
    throw new TypeError('value: Arg must be an Identity, Writer or Monoid')
  }

  return m.value()
}

module.exports = value
