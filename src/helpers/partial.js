/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import curry from '../core/curry.js'
import isFunction from '../core/isFunction.js'

// partial : ((* -> c), *) -> * -> c
function partial(...args) {
  const fn = args[0]
  const xs = args.slice(1)

  if(!isFunction(fn)) {
    throw new TypeError('partial: Function required for first argument')
  }

  return curry(
    Function.bind.apply(fn, [ null ].concat(xs))
  )
}

export default partial
