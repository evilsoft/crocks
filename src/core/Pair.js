/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 3

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
      throw new TypeError('Pair.merge: Binary function required')
    }

    return fn(fst(), snd())
  }

  function equals(m) {
    return isSameType(Pair, m)
      && _equals(m.fst(), fst())
      && _equals(m.snd(), snd())
  }

  function concat(m) {
    if(!(m && isSameType(Pair, m))) {
      throw new TypeError('Pair.concat: Pair required')
    }

    const lf = fst()
    const ls = snd()
    const rf = m.fst()
    const rs = m.snd()

    if(!(isSemigroup(lf) && isSemigroup(ls))) {
      throw new TypeError('Pair.concat: Both Pairs must contain Semigroups of the same type')
    }

    if(!(isSameType(lf, rf) && isSameType(ls, rs))) {
      throw new TypeError('Pair.concat: Both Pairs must contain Semigroups of the same type')
    }

    return Pair(
      lf.concat(rf),
      ls.concat(rs)
    )
  }

  function swap(f, g) {
    if(!isFunction(f) || !isFunction(g)) {
      throw new TypeError('Pair.swap: Requires both left and right functions')
    }

    return Pair(g(r), f(l))
  }

  function map(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Pair.map: Function required')
    }

    return Pair(l, fn(r))
  }

  function bimap(f, g) {
    if(!isFunction(f) || !isFunction(g)) {
      throw new TypeError('Pair.bimap: Function required for both arguments')
    }

    return Pair(f(l), g(r))
  }

  function ap(m) {
    if(!isSameType(Pair, m)) {
      throw new TypeError('Pair.ap: Pair required')
    }

    const fn = snd()

    if(!isFunction(fn)) {
      throw new TypeError('Pair.ap: Function required for second value')
    }

    const l = fst()
    const r = m.fst()

    if(!(isSemigroup(l) && isSameType(l, r))) {
      throw new TypeError('Pair.ap: Semigroups of the same type is required for first values')
    }

    return Pair(l.concat(r), fn(m.snd()))
  }

  function chain(fn) {
    const l = fst()

    if(!isFunction(fn)) {
      throw new TypeError('Pair.chain: Function required')
    }

    if(!isSemigroup(l)) {
      throw new TypeError('Pair.chain: Semigroups of the same type required for first values')
    }

    const m = fn(snd())

    if(!isSameType(Pair, m)) {
      throw new TypeError('Pair.chain: Function must return a Pair')
    }

    const r = m.fst()

    if(!isSameType(l, r)) {
      throw new TypeError('Pair.chain: Semigroups of the same type required for first values')
    }

    return Pair(
      l.concat(r),
      m.snd()
    )
  }

  function sequence(f) {
    if(!(isApplicative(f) || isFunction(f))) {
      throw new TypeError(
        'Pair.sequence: Applicative TypeRep or Apply returning function required'
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
        'Pair.traverse: Applicative TypeRep or Apply returning function required for first argument'
      )
    }

    if(!isFunction(fn)) {
      throw new TypeError(
        'Pair.traverse: Apply returning function required for second argument'
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

  function extend(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Pair.extend: Function required')
    }

    return Pair(l, fn(Pair(l, r)))
  }

  return {
    inspect, toString: inspect, fst,
    snd, toArray, type, merge, equals,
    concat, swap, map, bimap, ap, chain,
    sequence, traverse, extend,
    [fl.equals]: equals,
    [fl.concat]: concat,
    [fl.map]: map,
    [fl.bimap]: bimap,
    [fl.chain]: chain,
    [fl.extend]: extend,
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
