/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('../predicates/isFunction')
const isNumber = require('../predicates/isNumber')

const argsArray = require('../internal/argsArray')

function curryN(n, fn) {
  if(!isNumber(n)) {
    throw new TypeError('curryN: Number required for first argument')
  }
  if(!isFunction(fn)) {
    throw new TypeError('curryN: Function required for second argument')
  }

  return function() {
    const xs =
      argsArray(arguments)

    const args =
      xs.length ? xs : [ undefined ]

    const remaining =
       Math.floor(n) - args.length

    return (remaining > 0)
      ? curryN(remaining, Function.bind.apply(fn, [ null ].concat(args)))
      : fn.apply(null, args.slice(0, n))
  }
}

module.exports = curryN
