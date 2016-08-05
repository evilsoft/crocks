const isFunction  = require('../internal/isFunction')
const isType      = require('../internal/isType')

const _inspect = require('../funcs/inspect')

const composeB = require('../combinators/composeB')
const constant = require('../combinators/constant')

const _of   = x => Reader(constant(x))
const _type = constant('Reader')

function Reader(runWith) {
  if(!arguments.length || !isFunction(runWith)) {
    throw new TypeError('Reader: Must wrap a function')
  }

  const type    = _type
  const of      = _of
  const inspect = constant(`Reader${_inspect(runWith)}`)

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

  return { inspect, type, runWith, map, ap, chain, of }
}

Reader.of   = _of
Reader.type = _type

module.exports = Reader
