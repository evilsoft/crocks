/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isApplicative = require('../predicates/isApplicative')
const isFunction = require('../predicates/isFunction')
const isSameType = require('../predicates/isSameType')

const _inspect = require('../internal/inspect')

const composeB = require('../combinators/composeB')
const constant = require('../combinators/constant')
const identity = require('../combinators/identity')

const _type =
  constant('Identity')

const _of =
  Identity

function Identity(x) {
  if(!arguments.length) {
    throw new TypeError('Identity: Must wrap something')
  }

  const value =
    constant(x)

  const type =
    _type

  const of =
    _of

  const equals =
    m => isSameType(Identity, m) && x === m.value()

  const inspect =
    constant(`Identity${_inspect(x)}`)

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
      throw new TypeError('Identity.chain: function must return an Identity')
    }

    return m
  }

  function sequence(af) {
    if(!isFunction(af)) {
      throw new TypeError('Identity.sequence: Applicative Function required')
    }
    else if(!isApplicative(x)) {
      throw new TypeError('Identity.sequence: Must wrap an Applicative')
    }

    return x.map(Identity)
  }

  function traverse(af, f) {
    if(!isFunction(f) || !isFunction(af)) {
      throw new TypeError('Identity.traverse: Applicative returning functions required for both arguments')
    }

    const m = f(x)

    if(!isApplicative(m)) {
      throw new TypeError('Identity.traverse: Both functions must return an Applicative')
    }

    return m.map(Identity)
  }

  return {
    inspect, value, type, equals,
    map, ap, of, chain, sequence,
    traverse
  }
}

Identity.of =
  _of

Identity.type =
  _type

module.exports = Identity
