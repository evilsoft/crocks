const constant = require('../combinators/constant')

const isType      = require('../internal/isType')
const isFunction  = require('../internal/isFunction')
const isSemigroup = require('../internal/isSemigroup')

const _inspect = require('../funcs/inspect')

const _type = constant('Pair')

function Pair(f, s) {
  if(arguments.length < 2) {
    throw new TypeError('Pair: Must provide a first and second value')
  }

  const type  = _type
  const value = constant([ f, s ])
  const fst   = constant(f)
  const snd   = constant(s)

  const inspect = () => `Pair [${_inspect(f)},${_inspect(s)} ]`

  function equals(m) {
    return isType(type(), m)
      && m.fst() === fst()
      && m.snd() === snd()
  }

  function concat(m) {
    if(!(m && isType(type(), m))) {
      throw new TypeError('Pair.concat: Pair required')
    }
    else if(!isSemigroup(fst()) || !isSemigroup(snd())) {
      throw new TypeError('Pair.concat: Source Pair must contain Semigroups')
    }
    else if(!isSemigroup(m.fst()) || !isSemigroup(m.snd())) {
      throw new TypeError('Pair.concat: Provided Pair must contain Semigroups')
    }

    return Pair(
      fst().concat(m.fst()),
      snd().concat(m.snd())
    )
  }

  function map(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Pair.map: Function required')
    }

    return Pair(f, fn(s))
  }

  function bimap(lf, rf) {
    if(!isFunction(lf) || !isFunction(rf)) {
      throw new TypeError('Pair.bimap: Function required for both arguments')
    }

    return Pair(
      lf(f),
      rf(s)
    )
  }

  function ap(m) {
    if(!isFunction(snd())) {
      throw new TypeError('Pair.ap: Function required for second value')
    }
    else if(!isSemigroup(fst())) {
      throw new TypeError('Pair.ap: Semigroup required for first value')
    }
    else if(!(m && isType(type(), m))) {
      throw new TypeError('Pair.ap: Pair required')
    }
    else if(!isSemigroup(m.fst())) {
      throw new TypeError('Pair.ap: Semigroup required for first value')
    }

    return chain(fn => m.map(fn))
  }

  function chain(fn) {
    if(!isSemigroup(fst())) {
      throw new TypeError('Pair.chain: Semigroup required for first value')
    }
    else if(!isFunction(fn)) {
      throw new TypeError('Pair.chain: Function required')
    }

    const m = fn(snd())

    if(!isSemigroup(m.fst())) {
      throw new TypeError('Pair.chain: Semigroup required for first value of chained function result')
    }

    return Pair(
      fst().concat(m.fst()),
      m.snd()
    )
  }

  return {
    inspect, value, fst, snd,
    type, equals, concat,
    map, bimap, ap, chain
  }
}

Pair.type = _type

module.exports = Pair
