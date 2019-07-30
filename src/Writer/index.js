/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 3

const _equals = require('../core/equals')
const _implements = require('../core/implements')
const _inspect = require('../core/inspect')
const __type = require('../core/types').type('Writer')()
const _typeString = require('../core/types').typeFn(__type, VERSION)
const fl = require('../core/flNames')

const Pair = require('../core/Pair')

const isFunction = require('../core/isFunction')
const isMonoid = require('../core/isMonoid')
const isSameType = require('../core/isSameType')

const constant = x => () => x

function _Writer(Monoid) {
  if(!isMonoid(Monoid)) {
    throw new TypeError('Writer: Argument must be a Monoid Constructor')
  }

  const _of = x =>
    Writer(Monoid.empty(), x)

  const _type =
    constant(`${__type}(${Monoid.type()})`)

  const typeString =
    `${_typeString}( ${Monoid['@@type']} )`

  function Writer(entry, val) {
    if(arguments.length !== 2) {
      throw new TypeError(`${_type()}: Must be contructed with both a log entry and a value`)
    }

    if(!isSameType(Monoid, entry)) {
      throw new TypeError(`${_type()}: Log entry must be an instance of ${Monoid.type()}`)
    }

    const type =
      _type

    const of =
      _of

    const equals =
      m => isSameType(Writer, m)
        && _equals(m.valueOf(), val)

    const valueOf =
      constant(val)

    const log = () =>
      entry

    const inspect =
      constant(`Writer(${_inspect(log())}${_inspect(valueOf())} )`)

    const read = () =>
      Pair(log(), val)

    function map(method) {
      return function(fn) {
        if(!isFunction(fn)) {
          throw new TypeError(`${_type()}.${method}: Function required`)
        }

        return Writer(log(), fn(valueOf()))
      }
    }

    function ap(m) {
      if(!isFunction(val)) {
        throw new TypeError(`${_type()}.ap: Wrapped value must be a function`)
      }

      if(!isSameType(Writer, m)) {
        throw new TypeError(`${_type()}.ap: Writer required`)
      }

      return Writer(
        log().concat(m.log()),
        val(m.valueOf())
      )
    }

    function chain(method) {
      return function(fn) {
        if(!isFunction(fn)) {
          throw new TypeError(`${_type()}.${method}: Function required`)
        }

        const w = fn(valueOf())

        if(!isSameType(Writer, w)) {
          throw new TypeError(`${_type()}.${method}: Function must return a Writer`)
        }

        return Writer(log().concat(w.log()), w.valueOf())
      }
    }

    return {
      inspect, toString: inspect, read,
      valueOf, log, type, equals,
      ap, of,
      chain: chain('chain'),
      map: map('map'),
      [fl.of]: of,
      [fl.equals]: equals,
      [fl.map]: map(fl.map),
      [fl.chain]: chain(fl.chain),
      ['@@type']: typeString,
      constructor: Writer
    }
  }

  Writer.of = _of
  Writer.type = _type

  Writer[fl.of] = _of
  Writer['@@type'] = typeString

  Writer['@@implements'] = _implements(
    [ 'ap', 'chain', 'equals', 'map', 'of' ]
  )

  return Writer
}

module.exports = _Writer
