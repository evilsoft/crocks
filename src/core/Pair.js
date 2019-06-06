/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 4

const _equals = require('./equals')
const _implements = require('./implements')
const _inspect = require('./inspect')
const type = require('./types').type('Pair')
const _type = require('./types').typeFn(type(), VERSION)
const fl = require('./flNames')

const isApplicative = require('./isApplicative')
const isApply = require('./isApply')
const isArray = require('./isArray')
const isFunction = require('./isFunction')
const isSameType = require('./isSameType')
const isSemigroup = require('./isSemigroup')

function Pair(l, r) {
  if(arguments.length < 2) {
    throw new TypeError('Pair: Must provide a first and second value')
  }

  const fst =
    () => l

  const snd =
    () => r

  const inspect =
    () => `Pair(${_inspect(l)},${_inspect(r)} )`

  const toArray =
    () => [ l, r ]

  function merge(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Pair.merge: Argument must be a binary Function')
    }

    return fn(fst(), snd())
  }

  function equals(m) {
    return isSameType(Pair, m)
      && _equals(m.fst(), fst())
      && _equals(m.snd(), snd())
  }

  function concat(method) {
    return function(m) {
      if(!isSameType(Pair, m)) {
        throw new TypeError(`Pair.${method}: Argument must be a Pair`)
      }

      const lf = fst()
      const ls = snd()
      const rf = m.fst()
      const rs = m.snd()

      if(!(isSemigroup(lf) && isSemigroup(ls))) {
        throw new TypeError(`Pair.${method}: Both Pairs must contain Semigroups of the same type`)
      }

      if(!(isSameType(lf, rf) && isSameType(ls, rs))) {
        throw new TypeError(`Pair.${method}: Both Pairs must contain Semigroups of the same type`)
      }

      return Pair(
        lf.concat(rf),
        ls.concat(rs)
      )
    }
  }

  function swap(f, g) {
    if(!isFunction(f) || !isFunction(g)) {
      throw new TypeError('Pair.swap: Both arguments must be Functions')
    }

    return Pair(g(r), f(l))
  }

  function map(method) {
    return function(fn) {
      if(!isFunction(fn)) {
        throw new TypeError(`Pair.${method}: Argument must be a Function`)
      }

      return Pair(l, fn(r))
    }
  }

  function bimap(method) {
    return function(f, g) {
      if(!isFunction(f) || !isFunction(g)) {
        throw new TypeError(`Pair.${method}: Both arguments must be Functions`)
      }

      return Pair(f(l), g(r))
    }
  }

  function ap(m) {
    if(!isSameType(Pair, m)) {
      throw new TypeError('Pair.ap: Argument must be a Pair')
    }

    const fn = snd()

    if(!isFunction(fn)) {
      throw new TypeError('Pair.ap: Second value must be a Function')
    }

    const l = fst()
    const r = m.fst()

    if(!(isSemigroup(l) && isSameType(l, r))) {
      throw new TypeError('Pair.ap: First values must be Semigroups of the same type')
    }

    return Pair(l.concat(r), fn(m.snd()))
  }

  function chain(method) {
    return function(fn) {
      const l = fst()

      if(!isFunction(fn)) {
        throw new TypeError(`Pair.${method}: Argument must be a Function`)
      }

      if(!isSemigroup(l)) {
        throw new TypeError(`Pair.${method}: First values must be Semigroups of the same type`)
      }

      const m = fn(snd())

      if(!isSameType(Pair, m)) {
        throw new TypeError(`Pair.${method}: Function must return a Pair`)
      }

      const r = m.fst()

      if(!isSameType(l, r)) {
        throw new TypeError(`Pair.${method}: First values must be Semigroups of the same type`)
      }

      return Pair(
        l.concat(r),
        m.snd()
      )
    }
  }

  function sequence(f) {
    if(!(isApplicative(f) || isFunction(f))) {
      throw new TypeError(
        'Pair.sequence: Argument must be an Applicative TypeRep or a Function that returns an Apply'
      )
    }

    if(!(isApply(r) || isArray(r))) {
      throw new TypeError(
        'Pair.sequence: Must wrap an Apply in the second'
      )
    }

    return r.map(v => Pair(l, v))
  }

  function traverse(f, fn) {
    if(!(isApplicative(f) || isFunction(f))) {
      throw new TypeError(
        'Pair.traverse: First argument must be an Applicative TypeRep or a Function that returns an Apply'
      )
    }

    if(!isFunction(fn)) {
      throw new TypeError(
        'Pair.traverse: Second argument must be a Function that returns an Apply'
      )
    }

    const m = fn(r)

    if(!(isApply(m) || isArray(m))) {
      throw new TypeError(
        'Pair.traverse: Both functions must return an Apply of the same type'
      )
    }

    return m.map(v => Pair(l, v))
  }

  function extend(method) {
    return function(fn) {
      if(!isFunction(fn)) {
        throw new TypeError(`Pair.${method}: Argument must be a Function`)
      }

      return Pair(l, fn(Pair(l, r)))
    }
  }

  return {
    inspect, toString: inspect, fst,
    snd, toArray, type, merge, equals,
    swap, ap, sequence, traverse,
    concat: concat('concat'),
    map: map('map'),
    bimap: bimap('bimap'),
    chain: chain('chain'),
    extend: extend('extend'),
    [fl.equals]: equals,
    [fl.concat]: concat(fl.concat),
    [fl.map]: map(fl.map),
    [fl.bimap]: bimap(fl.bimap),
    [fl.chain]: chain(fl.chain),
    [fl.extend]: extend(fl.extend),
    ['@@type']: _type,
    constructor: Pair
  }
}

Pair.type = type
Pair['@@type'] = _type

Pair['@@implements'] = _implements(
  [ 'ap', 'bimap', 'chain', 'concat', 'extend', 'equals', 'map', 'traverse' ]
)

module.exports = Pair
