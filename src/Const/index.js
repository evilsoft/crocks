/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const _implements = require('../core/implements')
const _inspect = require('../core/inspect')
const _type = require('../core/types').types('Const')

const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')

function Const(x) {
  if(!arguments.length) {
    throw new TypeError('Const: Must wrap something')
  }

  const equals =
    m => isSameType(Const, m) && x === m.value()

  const inspect =
    () => `Const${_inspect(x)}`

  const value =
    () => x

  const type =
    _type

  function concat(m) {
    if(!isSameType(Const, m)) {
      throw new TypeError('Const.concat: Const required')
    }

    return Const(x)
  }

  function map(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Const.map: Function required')
    }

    return Const(x)
  }

  function ap(m) {
    if(!isSameType(Const, m)) {
      throw new TypeError('Const.ap: Const required')
    }

    return Const(x)
  }

  function chain(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Const.chain: Function required')
    }

    return Const(x)
  }

  return {
    inspect, value, type, equals,
    concat, map, ap, chain
  }
}
Const.type =
  _type

Const['@@implements'] = _implements(
  [ 'ap', 'chain', 'concat', 'equals', 'map' ]
)

module.exports = Const
