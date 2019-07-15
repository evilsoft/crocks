/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('./isFunction')

const reduceApply = (fn, args) =>
  args.reduce((f, arg) => isFunction(f) ? f(arg) : f, fn)

const finalizeResult = a =>
  isFunction(a) ? finalizeResult(a()) : a

function curryN(n, fn) {
  return function(...xs) {
    const args = xs.length ? xs : [ undefined ]
    const toApply = args.slice(0, Math.min(n, args.length))
    const remaining = Math.floor(n) - args.length
    const result = reduceApply(fn, toApply)

    return remaining > 0
      ? curryN(remaining, result)
      : finalizeResult(result)
  }
}

module.exports = curryN
