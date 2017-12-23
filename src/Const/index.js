/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const _equals = require('../core/equals')
const _implements = require('../core/implements')
const _inspect = require('../core/inspect')
const type = require('../core/types').type('Const')

const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')

function Const(x) {
  if(!arguments.length) {
    throw new TypeError('Const: Must wrap something')
  }

  const equals =
    m => isSameType(Const, m)
      && _equals(x, m.valueOf())

  const inspect =
    () => `Const${_inspect(x)}`

  const valueOf =
    () => x

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
    inspect, valueOf, type, equals,
    concat, map, ap, chain,
    constructor: Const
  }
}

Const.type =
  type

Const['@@implements'] = _implements(
  [ 'ap', 'chain', 'concat', 'equals', 'map' ]
)

module.exports = Const
