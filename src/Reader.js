/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const _implements = require('./core/implements')
const _inspect = require('./core/inspect')
const compose = require('./core/compose')
const constant = require('./core/constant')
const isFunction = require('./core/isFunction')
const isSameType = require('./core/isSameType')

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

    return Reader(compose(fn, runWith))
  }

  function ap(m) {
    if(!isSameType(Reader, m)) {
      throw new TypeError('Reader.ap: Reader required')
    }

    return chain(f => m.map(f))
  }

  function chain(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Reader.chain: Function required')
    }

    return Reader(function(e) {
      const m = fn(runWith(e))

      if(!isSameType(Reader, m)) {
        throw new TypeError('Reader.chain: Function must return a Reader')
      }

      return m.runWith(e)
    })
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

Reader['@@implements'] = _implements(
  [ 'ap', 'chain', 'map', 'of' ]
)

module.exports = Reader
