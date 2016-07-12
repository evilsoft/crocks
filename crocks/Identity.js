const isFunction = require('../internal/isFunction')
const isType    = require('../internal/isType')

function Identity(x) {
  if(!arguments.length) {
    throw new TypeError('Identity must wrap something')
  }

  const value = () => x
  const type  = () => 'Identity'
  const of    = Identity.of

  function equals(m) {
    return isFunction(m.type)
      && type() === m.type()
      && x === m.value()
  }

  function map(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Identity.map: function required')
    }

    return Identity(fn(x))
  }

  function ap(m) {
    if(!isFunction(x)) {
      throw new TypeError('Identity.ap: Wrapped value must be a function')
    }

    if(!isType(type(), m)) {
      throw new TypeError('Identity.ap: Identity required')
    }
    return m.map(x)
  }

  function chain(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Identity.chain: function required')
    }

    return map(fn).value()
  }

  return { value, type, equals, map, ap, of, chain }
}

Identity.of = x => Identity(x)

module.exports = Identity
