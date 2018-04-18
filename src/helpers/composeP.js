/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import isFunction from '../core/isFunction.js'
import isPromise from '../core/isPromise.js'

const err = 'composeP: Promise returning functions required'

function applyPipe(f, g) {
  if(!isFunction(g)) {
    throw new TypeError(err)
  }

  return function() {
    const p = f.apply(null, arguments)

    if(!isPromise(p)) {
      throw new TypeError(err)
    }

    return p.then(g)
  }
}

function composeP(...args) {
  if(!arguments.length) {
    throw new TypeError(err)
  }

  const fns =
    args.reverse()

  const head =
    fns[0]

  if(!isFunction(head)) {
    throw new TypeError(err)
  }

  const tail =
    fns.slice(1).concat(x => x)

  return tail.reduce(applyPipe, head)
}

export default composeP
