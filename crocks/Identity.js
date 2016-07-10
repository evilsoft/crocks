const isFunction = require('../internal/isFunction')

function Identity(x) {
  if(!arguments.length) {
    throw new TypeError('Identity must wrap something')
  }

  const value = () => x
  const type  = () => 'Identity'

  function equals(m) {
    return isFunction(m.type)
      && type() === m.type()
      && x === m.value()
  }

  function map(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Identity.map must be passed a function')
    }

    return Identity(fn(x))
  }

  return { value, type, equals, map }
}

module.exports = Identity
