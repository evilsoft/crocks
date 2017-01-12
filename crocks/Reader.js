/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('../internal/isFunction')
const isType = require('../internal/isType')

const _inspect = require('../internal/inspect')

const composeB = require('../combinators/composeB')
const constant = require('../combinators/constant')

const _of =
  x => Reader(constant(x))

const _type =
  constant('Reader')

function ask(fn) {
  if(!isFunction(fn)) {
    throw new TypeError('Reader.ask: Function required')
  }
  return Reader(fn)
}

function Reader(runWith) {
  if(!arguments.length || !isFunction(runWith)) {
    throw new TypeError('Reader: Must wrap a function')
  }

  const type =
    _type

  const of =
    _of

  const inspect =
    constant(`Reader${_inspect(runWith)}`)

  function map(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Reader.map: Function required')
    }

    return Reader(composeB(fn, runWith))
  }

  function ap(m) {
    if(!isType(type(), m)) {
      throw new TypeError('Reader.ap: Reader required')
    }

    return chain(f => m.map(f))
  }

  function chain(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Reader.chain: Function required')
    }

    return Reader(e => fn(runWith(e)).runWith(e))
  }

  return {
    inspect, runWith, type,
    map, ap, chain, of
  }
}

Reader.of =
  _of

Reader.type =
  _type

Reader.ask =
  ask

module.exports = Reader
