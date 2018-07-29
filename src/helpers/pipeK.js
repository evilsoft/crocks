/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import isChain from '../core/isChain'
import isFunction from '../core/isFunction'

const err = 'pipeK: Chain returning functions of the same type required'

export default function pipeK(head, ...fns) {
  if(!(arguments.length && isFunction(head))) {
    throw new TypeError(err)
  }

  if(arguments.length === 1) {
    return head
  }

  const tail = fns.reduce((comp, fn) => {
    if(!isFunction(fn)) {
      throw new TypeError(err)
    }

    return function(m) {
      if(!isChain(m)) {
        throw new TypeError(err)
      }
      return comp(m).chain(fn)
    }
  }, x => x)

  return function() {
    return tail(head.apply(null, arguments))
  }
}
