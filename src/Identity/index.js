/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 1

const _equals = require('../core/equals')
const _implements = require('../core/implements')
const _innerConcat = require('../core/innerConcat')
const _inspect = require('../core/inspect')
const type = require('../core/types').type('Identity')
const _type = require('../core/types').typeFn(type(), VERSION)
const fl = require('../core/flNames')

const isArray = require('../core/isArray')
const isApply = require('../core/isApply')
const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')

const _of =
  Identity

function Identity(x) {
  if(!arguments.length) {
    throw new TypeError('Identity: Must wrap something')
  }

  const valueOf =
    () => x

  const of =
    _of

  const equals =
    m => isSameType(Identity, m)
      && _equals(x, m.valueOf())

  const inspect =
    () => `Identity${_inspect(x)}`

  function concat(m) {
    if(!isSameType(Identity, m)) {
      throw new TypeError('Identity.concat: Identity of Semigroup required')
    }

    return _innerConcat(Identity, m)(x)
  }

  function map(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Identity.map: Function required')
    }

    return Identity(fn(x))
  }

  function ap(m) {
    if(!isFunction(x)) {
      throw new TypeError('Identity.ap: Wrapped value must be a function')
    }

    else if(!isSameType(Identity, m)) {
      throw new TypeError('Identity.ap: Identity required')
    }

    return m.map(x)
  }

  function chain(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Identity.chain: Function required')
    }

    const m = fn(x)

    if(!isSameType(Identity, m)) {
      throw new TypeError('Identity.chain: Function must return an Identity')
    }

    return m
  }

  function sequence(af) {
    if(!isFunction(af)) {
      throw new TypeError('Identity.sequence: Apply function required')
    }

    else if(!(isApply(x) || isArray(x))) {
      throw new TypeError('Identity.sequence: Must wrap an Apply')
    }

    return x.map(v => Identity(v))
  }

  function traverse(af, f) {
    if(!isFunction(f) || !isFunction(af)) {
      throw new TypeError('Identity.traverse: Apply returning functions required for both arguments')
    }

    const m = f(x)

    if(!(isApply(m) || isArray(m))) {
      throw new TypeError('Identity.traverse: Both functions must return an Apply')
    }

    return m.map(v => Identity(v))
  }

  return {
    inspect, toString: inspect, valueOf,
    type, equals, concat, map, ap, of,
    chain, sequence, traverse,
    [fl.of]: of,
    [fl.equals]: equals,
    [fl.concat]: concat,
    [fl.map]: map,
    [fl.chain]: chain,
    ['@@type']: _type,
    constructor: Identity
  }
}

Identity.of = _of
Identity.type = type

Identity[fl.of] = _of
Identity['@@type'] = _type

Identity['@@implements'] = _implements(
  [ 'ap', 'chain', 'concat', 'equals', 'map', 'of', 'traverse' ]
)

module.exports = Identity
