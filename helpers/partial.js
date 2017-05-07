/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const argsArray = require('../internal/argsArray')
const curry = require('./curry')
const isFunction = require('../predicates/isFunction')

// partial : ((* -> c), *) -> * -> c
function partial() {
  const args = argsArray(arguments)

  const fn = args[0]
  const xs = args.slice(1)

  if(!isFunction(fn)) {
    throw new TypeError('partial: Function required for first argument')
  }

  return curry(
    Function.bind.apply(fn, [ null ].concat(xs))
  )
}

module.exports = partial
