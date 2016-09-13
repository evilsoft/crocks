/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isType = require('../internal/isType')
const isFunction = require('../internal/isFunction')
const isMonoid = require('../internal/isMonoid')
const isArray = require('../internal/isArray')

const _inspect = require('../funcs/inspect')
const mconcat = require('../funcs/mconcat')

const constant = require('../combinators/constant')

const wrapValue =
  x => isArray(x) ? x.slice() : [ x ]

const _of =
  x => Writer([], x)

const _type =
  constant('Writer')

function Writer(entry, val) {
  if(arguments.length !== 2) {
    throw new TypeError('Writer: Requires a log entry and a value')
  }

  const type =
    _type

  const of =
    _of

  const equals =
    m => isType(type(), m) && m.value() === value()

  const value =
    constant(val)

  const log =
    constant(wrapValue(entry))

  const inspect =
    constant(`Writer(${_inspect(log())}${_inspect(value())} )`)

  const read = constant({
    log: log(),
    value: value()
  })

  function map(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Writer.map: Function required')
    }

    return Writer(log(), fn(value()))
  }

  function ap(m) {
    if(!isFunction(value())) {
      throw new TypeError('Writer.ap: Wrapped value must be a function')
    }
    else if(!isType(type(), m)) {
      throw new TypeError('Writer.ap: Writer required')
    }

    return chain(fn => m.map(fn))
  }

  function chain(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Writer.chain: Function required')
    }

    const w = fn(value())

    if(!(w && isType(type(), w))) {
      throw new TypeError('Writer.chain: function must return a Writer')
    }

    return Writer(log().concat(w.log()), w.value())
  }

  function reduceLog(fn, init) {
    if(!isFunction(fn)) {
      throw new TypeError('Writer.reduceLog: Function required')
    }

    return Writer(log().reduce(fn, init), value())
  }

  function mreduceLog(m) {
    if(!isMonoid(m)) {
      throw new TypeError('Writer.mreduceLog: Monoid required')
    }

    return Writer(mconcat(m, log()).value(), value())
  }

  return {
    inspect, read, value, log,
    reduceLog, mreduceLog, type,
    equals, map, ap, of, chain
  }
}

Writer.of =
  _of

Writer.type =
  _type

module.exports = Writer
