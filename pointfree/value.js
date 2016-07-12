const isFunction = require('../internal/isFunction')

function value(m) {
  if(!isFunction(m.value)) {
    throw new TypeError('Argument to value must be an Identity')
  }

  return m.value()
}

module.exports = value
