/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isType = require('../internal/isType')
const isFunction = require('../internal/isFunction')
const isMonoid = require('../internal/isMonoid')

const _inspect = require('../helpers/inspect')

const constant = require('../combinators/constant')

function _Writer(Monoid) {
  if(!isMonoid(Monoid)) {
    throw new TypeError('Writer: Monoid required for construction')
  }

  const _of =
    x => Writer(Monoid.empty().value(), x)

  const _type =
    constant(`Writer(${Monoid.type()})`)

  function Writer(entry, val) {
    if(arguments.length !== 2) {
      throw new TypeError('Writer: Log entry and a value required')
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
      constant(Monoid(entry))

    const inspect =
      constant(`Writer(${_inspect(log())}${_inspect(value())} )`)

    const read = constant({
      log: log().value(),
      value: value()
    })

    function map(fn) {
      if(!isFunction(fn)) {
        throw new TypeError('Writer.map: Function required')
      }

      return Writer(log().value(), fn(value()))
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

      return Writer(log().concat(w.log()).value(), w.value())
    }

    return {
      inspect, read, value,
      log, type, equals, map,
      ap, of, chain
    }
  }

  Writer.of =
    _of

  Writer.type =
    _type

  return Writer
}


module.exports = _Writer
